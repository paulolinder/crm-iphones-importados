import { createError } from 'h3'
import { buildCommercialOrderPdf } from '../../../utils/buildCommercialOrderPdf'
import { fetchOrderCommercialPdfPayload } from '../../../utils/orderCommercialPdfData'
import { commercialDocumentStoragePath } from '../../../utils/orderCommercialPaths'
import { requireOrderPermission } from '../../../utils/requireOrderPermission'
import { getSupabaseServerClient } from '~/lib/supabase/server'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID do pedido inválido' })
  }

  const { userClient } = await requireOrderPermission(event, 'orders.update')
  const config = useRuntimeConfig(event)
  const storeName = config.public.appName ?? 'Eleve Imports CRM'

  const payload = await fetchOrderCommercialPdfPayload(userClient, id, storeName)
  if (!payload) {
    throw createError({ statusCode: 404, statusMessage: 'Pedido não encontrado' })
  }

  const pdfBytes = await buildCommercialOrderPdf(payload)
  const path = commercialDocumentStoragePath(id)
  const server = getSupabaseServerClient(event)

  const { error: upErr } = await server.storage
    .from('order_documents')
    .upload(path, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (upErr) {
    throw createError({
      statusCode: 502,
      statusMessage: `Falha ao enviar PDF ao armazenamento: ${upErr.message}`,
    })
  }

  const now = new Date().toISOString()
  const { error: dbErr } = await server
    .from('orders')
    .update({
      commercial_document_path: path,
      commercial_document_updated_at: now,
    })
    .eq('id', id)

  if (dbErr) {
    throw createError({
      statusCode: 500,
      statusMessage: `Pedido atualizado no storage, mas falhou ao salvar referência: ${dbErr.message}`,
    })
  }

  return { ok: true, path, commercial_document_updated_at: now }
})
