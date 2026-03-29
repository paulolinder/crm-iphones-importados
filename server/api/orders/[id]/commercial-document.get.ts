import { createError } from 'h3'
import { commercialDocumentStoragePath } from '../../../utils/orderCommercialPaths'
import { requireOrderPermission } from '../../../utils/requireOrderPermission'
import { getSupabaseServerClient } from '~/lib/supabase/server'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID do pedido inválido' })
  }

  const { userClient } = await requireOrderPermission(event, 'orders.read')

  const { data: order, error } = await userClient
    .from('orders')
    .select('order_number, commercial_document_path')
    .eq('id', id)
    .maybeSingle()

  if (error || !order) {
    throw createError({ statusCode: 404, statusMessage: 'Pedido não encontrado' })
  }

  const expected = commercialDocumentStoragePath(id)
  if (!order.commercial_document_path || order.commercial_document_path !== expected) {
    throw createError({ statusCode: 404, statusMessage: 'Nenhum documento anexado a este pedido' })
  }

  const server = getSupabaseServerClient(event)
  const { data: file, error: dlErr } = await server.storage
    .from('order_documents')
    .download(order.commercial_document_path)

  if (dlErr || !file) {
    throw createError({
      statusCode: 502,
      statusMessage: dlErr?.message ?? 'Não foi possível baixar o arquivo',
    })
  }

  const buf = new Uint8Array(await file.arrayBuffer())
  const safeName = order.order_number.replace(/[^\w\-#.]+/g, '_')

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="pedido-${safeName}-anexo.pdf"`)

  return buf
})
