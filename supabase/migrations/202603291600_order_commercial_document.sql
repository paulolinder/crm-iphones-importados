-- PDF comercial anexado ao pedido (referência no Storage)
alter table public.orders
  add column if not exists commercial_document_path text null,
  add column if not exists commercial_document_updated_at timestamptz null;

comment on column public.orders.commercial_document_path is 'Caminho no bucket order_documents (ex.: orders/{id}/pedido-comercial.pdf)';
comment on column public.orders.commercial_document_updated_at is 'Última gravação do PDF comercial no storage';

-- Bucket privado para PDFs de pedido (upload via service role nas API routes)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'order_documents',
  'order_documents',
  false,
  5242880,
  array['application/pdf']::text[]
)
on conflict (id) do nothing;
