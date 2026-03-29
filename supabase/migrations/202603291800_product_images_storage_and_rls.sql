-- Permite quem cria produto inserir imagens; quem atualiza mantém controle de alteração/remoção
drop policy if exists product_images_manage_policy on public.product_images;

create policy product_images_insert_policy on public.product_images
for insert
with check (
  public.current_user_has_permission('products.create')
  or public.current_user_has_permission('products.update')
);

create policy product_images_update_policy on public.product_images
for update
using (public.current_user_has_permission('products.update'))
with check (public.current_user_has_permission('products.update'));

create policy product_images_delete_policy on public.product_images
for delete
using (public.current_user_has_permission('products.update'));

-- Função para políticas do Storage (storage.objects não acessa RPC de permissão diretamente)
create or replace function public.current_user_can_manage_product_media()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_has_permission('products.create')
      or public.current_user_has_permission('products.update');
$$;

-- Bucket público: URLs diretas no catálogo
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product_images',
  'product_images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do nothing;

-- Leitura pública dos arquivos (bucket já é public; política explícita para SELECT)
drop policy if exists product_images_storage_public_read on storage.objects;
create policy product_images_storage_public_read on storage.objects
for select
using (bucket_id = 'product_images');

drop policy if exists product_images_storage_authenticated_insert on storage.objects;
create policy product_images_storage_authenticated_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'product_images'
  and public.current_user_can_manage_product_media()
);

drop policy if exists product_images_storage_authenticated_update on storage.objects;
create policy product_images_storage_authenticated_update on storage.objects
for update to authenticated
using (
  bucket_id = 'product_images'
  and public.current_user_can_manage_product_media()
)
with check (
  bucket_id = 'product_images'
  and public.current_user_can_manage_product_media()
);

drop policy if exists product_images_storage_authenticated_delete on storage.objects;
create policy product_images_storage_authenticated_delete on storage.objects
for delete to authenticated
using (
  bucket_id = 'product_images'
  and public.current_user_can_manage_product_media()
);
