import { createError } from 'h3'
import { buildCommercialOrderPdf } from '../../../utils/buildCommercialOrderPdf'
import { fetchOrderCommercialPdfPayload } from '../../../utils/orderCommercialPdfData'
import { requireOrderPermission } from '../../../utils/requireOrderPermission'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID do pedido inválido' })
  }

  const { userClient } = await requireOrderPermission(event, 'orders.read')
  const config = useRuntimeConfig(event)
  const storeName = config.public.appName ?? 'Eleve Imports CRM'

  const payload = await fetchOrderCommercialPdfPayload(userClient, id, storeName)
  if (!payload) {
    throw createError({ statusCode: 404, statusMessage: 'Pedido não encontrado' })
  }

  const pdfBytes = await buildCommercialOrderPdf(payload)
  const safeName = payload.orderNumber.replace(/[^\w\-#.]+/g, '_')

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="pedido-${safeName}.pdf"`)

  return pdfBytes
})
