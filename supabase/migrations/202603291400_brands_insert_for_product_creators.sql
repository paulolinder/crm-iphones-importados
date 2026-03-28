-- Quem pode criar produtos precisa poder cadastrar marca na hora (fluxo de catálogo).
-- Política existente brands_manage_policy continua para update/delete/select extra.
drop policy if exists brands_insert_if_product_create on public.brands;
create policy brands_insert_if_product_create on public.brands
for insert with check (public.current_user_has_permission('products.create'));
