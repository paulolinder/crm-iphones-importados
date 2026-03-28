-- =============================================================================
-- Cria o usuário de demonstração usado na tela de login (APENAS dev / primeiro setup).
-- Execute no SQL Editor do Supabase se auth.users estiver vazio.
-- Ajuste e-mail e senha antes de rodar em qualquer ambiente compartilhado.
-- =============================================================================
-- Senha padrão (igual ao hint na UI): 123456 — troque após o primeiro acesso.
-- =============================================================================

begin;

with new_user as (
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change,
    email_change_token_new,
    email_change_token_current,
    reauthentication_token,
    phone_change,
    phone_change_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@eleveimports.com',
    extensions.crypt('123456', extensions.gen_salt('bf', 10)),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', 'Administrador'),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  )
  returning id
)
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  gen_random_uuid(),
  new_user.id,
  jsonb_build_object(
    'sub', new_user.id::text,
    'email', 'admin@eleveimports.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  new_user.id::text,
  now(),
  now(),
  now()
from new_user;

commit;
