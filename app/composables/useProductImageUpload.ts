const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const MAX_BYTES = 5 * 1024 * 1024

/**
 * Upload para o bucket Supabase `product_images` (público).
 * Exige usuário autenticado com permissão de produtos (create ou update).
 */
export function useProductImageUpload() {
  const { client } = useSupabase()

  async function uploadProductImage(file: File): Promise<string> {
    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      throw new Error('Formato inválido. Use JPG, PNG, WebP ou GIF.')
    }
    if (file.size > MAX_BYTES) {
      throw new Error('Imagem muito grande. Tamanho máximo: 5 MB.')
    }

    const ext = EXT_BY_TYPE[file.type] ?? 'jpg'
    const path = `catalog/${crypto.randomUUID()}.${ext}`

    const { error } = await client.storage
      .from('product_images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw new Error(error.message || 'Falha ao enviar a imagem')
    }

    const { data } = client.storage.from('product_images').getPublicUrl(path)
    return data.publicUrl
  }

  return { uploadProductImage }
}
