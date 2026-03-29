/**
 * Caminho fixo do PDF comercial no bucket Supabase Storage (um arquivo por pedido).
 */
export function commercialDocumentStoragePath(orderId: string): string {
  return `orders/${orderId}/pedido-comercial.pdf`
}
