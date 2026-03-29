import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { CommercialOrderPdfPayload } from './orderCommercialPdfData'

const MARGIN = 48
const LINE = 14
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const CONTENT_W = PAGE_WIDTH - MARGIN * 2

const money = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

const when = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  }
  catch {
    return iso
  }
}

function wrapLine(text: string, font: import('pdf-lib').PDFFont, size: number, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    const next = current ? `${current} ${w}` : w
    if (font.widthOfTextAtSize(next, size) <= maxW) {
      current = next
    }
    else {
      if (current) {
        lines.push(current)
      }
      current = w
    }
  }
  if (current) {
    lines.push(current)
  }
  return lines.length ? lines : ['']
}

export async function buildCommercialOrderPdf(payload: CommercialOrderPdfPayload): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  const draw = (t: string, opts?: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb> }) => {
    const size = opts?.size ?? 10
    const f = opts?.bold ? fontBold : font
    const color = opts?.color ?? rgb(0.12, 0.16, 0.22)
    for (const line of wrapLine(t, f, size, CONTENT_W)) {
      if (y < MARGIN + LINE * 3) {
        page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        y = PAGE_HEIGHT - MARGIN
      }
      page.drawText(line, { x: MARGIN, y, size, font: f, color })
      y -= LINE * (size / 10)
    }
  }

  draw(payload.storeName, { bold: true, size: 16 })
  y -= LINE * 0.5
  draw('Pedido de venda / comprovante', { bold: true, size: 12 })
  y -= LINE * 0.25
  draw(`Pedido ${payload.orderNumber} · ${when(payload.createdAtIso)}`)
  y -= LINE

  draw('Cliente', { bold: true })
  draw(payload.customerName)
  if (payload.customerPhone) {
    draw(`Tel. ${payload.customerPhone}`)
  }
  if (payload.customerEmail) {
    draw(payload.customerEmail)
  }
  y -= LINE * 0.5

  draw('Situação', { bold: true })
  draw(`Status: ${payload.statusLabel} · Pagamento: ${payload.paymentStatusLabel}`)
  if (payload.paymentMethodLabel) {
    draw(`Forma: ${payload.paymentMethodLabel}`)
  }
  if (payload.sellerName) {
    draw(`Vendedor: ${payload.sellerName}`)
  }
  y -= LINE

  draw('Itens', { bold: true })
  y -= LINE * 0.25

  const colItem = MARGIN
  const colQty = MARGIN + 220
  const colTotal = PAGE_WIDTH - MARGIN - 72

  const headerY = y
  page.drawText('Descrição', { x: colItem, y: headerY, size: 9, font: fontBold, color: rgb(0.35, 0.39, 0.47) })
  page.drawText('Qtd', { x: colQty, y: headerY, size: 9, font: fontBold, color: rgb(0.35, 0.39, 0.47) })
  page.drawText('Total', { x: colTotal, y: headerY, size: 9, font: fontBold, color: rgb(0.35, 0.39, 0.47) })
  y = headerY - LINE * 1.2

  const rowGap = LINE * 0.95
  for (const it of payload.items) {
    const title = it.sku ? `${it.product_name} (${it.sku})` : it.product_name
    const lines = wrapLine(title, font, 9, colQty - colItem - 8)
    if (y < MARGIN + LINE * (4 + lines.length)) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      y = PAGE_HEIGHT - MARGIN
    }
    const topY = y
    lines.forEach((line, i) => {
      page.drawText(line, { x: colItem, y: topY - i * rowGap, size: 9, font, color: rgb(0.12, 0.16, 0.22) })
    })
    page.drawText(String(it.quantity), { x: colQty, y: topY, size: 9, font, color: rgb(0.12, 0.16, 0.22) })
    page.drawText(money(it.total_amount), { x: colTotal, y: topY, size: 9, font, color: rgb(0.12, 0.16, 0.22) })
    y = topY - lines.length * rowGap - LINE * 0.35
  }

  y -= LINE
  draw(`Subtotal: ${money(payload.subtotal)}`)
  draw(`Descontos: ${money(payload.discount_amount)}`)
  draw(`Frete: ${money(payload.shipping_amount)}`)
  draw(`Total: ${money(payload.total_amount)}`, { bold: true, size: 11 })
  y -= LINE

  if (payload.notes?.trim()) {
    draw('Observações', { bold: true })
    for (const line of wrapLine(payload.notes.trim(), font, 9, CONTENT_W)) {
      if (y < MARGIN + LINE * 8) {
        page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
        y = PAGE_HEIGHT - MARGIN
      }
      page.drawText(line, { x: MARGIN, y, size: 9, font, color: rgb(0.2, 0.22, 0.28) })
      y -= LINE * 0.95
    }
    y -= LINE
  }

  y -= LINE
  draw(
    'Declaro ter recebido os produtos/serviços descritos acima em perfeitas condições, '
      + 'conforme combinado.',
    { size: 9 },
  )
  y -= LINE * 2

  if (y < MARGIN + LINE * 10) {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    y = PAGE_HEIGHT - MARGIN
  }

  const sigY = y
  const mid = MARGIN + CONTENT_W / 2
  page.drawLine({ start: { x: MARGIN, y: sigY }, end: { x: mid - 16, y: sigY }, thickness: 0.5, color: rgb(0, 0, 0) })
  page.drawLine({ start: { x: mid + 16, y: sigY }, end: { x: PAGE_WIDTH - MARGIN, y: sigY }, thickness: 0.5, color: rgb(0, 0, 0) })
  page.drawText('Assinatura do cliente', { x: MARGIN, y: sigY - LINE, size: 8, font, color: rgb(0.35, 0.39, 0.47) })
  page.drawText('Carimbo / responsável pela loja', { x: mid + 16, y: sigY - LINE, size: 8, font, color: rgb(0.35, 0.39, 0.47) })
  page.drawText('Data: ____/____/________', { x: MARGIN, y: sigY - LINE * 2.2, size: 8, font, color: rgb(0.35, 0.39, 0.47) })

  const pdfBytes = await doc.save()
  return pdfBytes
}
