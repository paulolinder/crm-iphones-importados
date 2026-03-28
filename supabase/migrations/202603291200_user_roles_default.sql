begin;

-- Usuários sem nenhuma linha em user_roles falham em todas as políticas que usam
-- current_user_has_permission (ex.: INSERT em products). Só o primeiro perfil
-- recebia admin; os demais ficavam sem papel.
insert into public.user_roles (user_id, role_id)
select p.id, r.id
from public.profiles p
cross join lateral (
  select id from public.roles where slug = 'manager' limit 1
) r
where not exists (select 1 from public.user_roles ur where ur.user_id = p.id)
on conflict (user_id, role_id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_role_id uuid;
  manager_role_id uuid;
begin
  insert into public.profiles (id, email, first_name, last_name, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do update
  set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name,
    full_name = excluded.full_name,
    updated_at = timezone('utc', now());

  if (select count(*) from public.profiles) = 1 then
    select id into admin_role_id from public.roles where slug = 'admin' limit 1;

    if admin_role_id is not null then
      insert into public.user_roles (user_id, role_id)
      values (new.id, admin_role_id)
      on conflict (user_id, role_id) do nothing;
    end if;
  else
    select id into manager_role_id from public.roles where slug = 'manager' limit 1;

    if manager_role_id is not null then
      insert into public.user_roles (user_id, role_id)
      values (new.id, manager_role_id)
      on conflict (user_id, role_id) do nothing;
    end if;
  end if;

  return new;
end;
$$;

commit;
