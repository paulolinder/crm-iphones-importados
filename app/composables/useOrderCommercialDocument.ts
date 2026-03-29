/**
 * Download PDF comercial (gerado na hora) e salvar/baixar anexo no Storage.
 */
export function useOrderCommercialDocument() {
  const { session } = useAuth()
  const { success, error: toastError } = useToast()

  function bearerHeaders(): HeadersInit {
    const token = session.value?.access_token
    if (!token) {
      throw new Error('Sessão expirada. Faça login novamente.')
    }
    return { Authorization: `Bearer ${token}` }
  }

  async function downloadFreshPdf(orderId: string, orderNumber: string) {
    const res = await fetch(`/api/orders/${orderId}/commercial-pdf`, {
      headers: bearerHeaders(),
    })
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText)
      throw new Error(msg || 'Não foi possível gerar o PDF')
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pedido-${orderNumber.replace(/[^\w\-#.]+/g, '_')}.pdf`
    a.rel = 'noopener'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function downloadStoredPdf(orderId: string, orderNumber: string) {
    const res = await fetch(`/api/orders/${orderId}/commercial-document`, {
      headers: bearerHeaders(),
    })
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText)
      throw new Error(msg || 'Não foi possível baixar o anexo')
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pedido-${orderNumber.replace(/[^\w\-#.]+/g, '_')}-anexo.pdf`
    a.rel = 'noopener'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function attachPdfToOrder(orderId: string) {
    const res = await fetch(`/api/orders/${orderId}/commercial-document`, {
      method: 'POST',
      headers: bearerHeaders(),
    })
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText)
      throw new Error(msg || 'Falha ao salvar PDF no pedido')
    }
    return res.json() as Promise<{ ok: boolean; commercial_document_updated_at?: string }>
  }

  async function downloadFreshPdfWithToast(orderId: string, orderNumber: string) {
    try {
      await downloadFreshPdf(orderId, orderNumber)
      success('PDF pronto', 'Arquivo baixado com os dados atuais do pedido.')
    }
    catch (e) {
      toastError('PDF', e instanceof Error ? e.message : 'Erro ao gerar PDF')
    }
  }

  async function attachPdfWithToast(orderId: string, reload?: () => void | Promise<void>) {
    try {
      await attachPdfToOrder(orderId)
      success('Documento anexado', 'O PDF foi salvo no pedido. Você pode baixá-lo de novo quando precisar.')
      await reload?.()
    }
    catch (e) {
      toastError('Anexo', e instanceof Error ? e.message : 'Erro ao salvar no pedido')
    }
  }

  async function downloadStoredPdfWithToast(orderId: string, orderNumber: string) {
    try {
      await downloadStoredPdf(orderId, orderNumber)
      success('Download', 'PDF anexo baixado.')
    }
    catch (e) {
      toastError('Download', e instanceof Error ? e.message : 'Erro ao baixar')
    }
  }

  return {
    downloadFreshPdf,
    downloadStoredPdf,
    attachPdfToOrder,
    downloadFreshPdfWithToast,
    attachPdfWithToast,
    downloadStoredPdfWithToast,
  }
}
