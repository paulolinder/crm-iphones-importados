-- GoTrue (Auth) faz scan dos registros em auth.users esperando strings em várias colunas;
-- valores NULL (comuns em INSERTs SQL manuais) causam: "Database error querying schema"
-- / "converting NULL to string is unsupported" no login.
update auth.users set
  email_change = coalesce(email_change, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  recovery_token = coalesce(recovery_token, ''),
  confirmation_token = coalesce(confirmation_token, ''),
  reauthentication_token = coalesce(reauthentication_token, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, '');
