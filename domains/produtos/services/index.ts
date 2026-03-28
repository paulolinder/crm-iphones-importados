import type {
  Product,
  ProductBrand,
  ProductCategory,
  ProductFilters,
  ProductFormData,
  ProductStats,
} from '../types'
import type { PaginatedResponse, PaginationParams } from '~/types'
import type { Tables } from '~/lib/supabase/types'
import { slugify } from '~/lib/helpers'
import { assertSupabaseResult, buildPaginatedResponse, normalizeCurrencyValue } from '../../shared/service-utils'
import { productFormSchema, productUpdateSchema } from '../validation'

type ProductRow = Tables<'products'>
type BrandRow = Tables<'brands'>
type CategoryRow = Tables<'categories'>
type InventoryItemRow = Tables<'inventory_items'>
type ProductImageRow = Tables<'product_images'>

function mapBrand(brand: BrandRow | null | undefined): ProductBrand | undefined {
  if (!brand) {
    return undefined
  }

  return {
    id: brand.id,
    created_at: brand.created_at,
    updated_at: brand.updated_at,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    logo: brand.logo_url,
    active: brand.active,
  }
}

function mapCategory(category: CategoryRow | null | undefined): ProductCategory | undefined {
  if (!category) {
    return undefined
  }

  return {
    id: category.id,
    created_at: category.created_at,
    updated_at: category.updated_at,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parent_id: category.parent_id,
    image: category.image_url,
    active: category.active,
    sort_order: category.sort_order,
  }
}

function mapProduct(
  product: ProductRow,
  options?: {
    brand?: BrandRow | null
    category?: CategoryRow | null
    inventory?: InventoryItemRow | null
    images?: ProductImageRow[]
  },
): Product {
  const inventory = options?.inventory

  return {
    id: product.id,
    created_at: product.created_at,
    updated_at: product.updated_at,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    description: product.description,
    category_id: product.category_id,
    brand_id: product.brand_id,
    price: normalizeCurrencyValue(product.sale_price),
    cost: normalizeCurrencyValue(product.cost_price),
    promotional_price: product.promotional_price,
    stock_quantity: inventory?.quantity ?? 0,
    min_stock: inventory?.min_stock ?? product.min_stock,
    max_stock: inventory?.max_stock ?? product.max_stock,
    weight: product.weight,
    dimensions: (product.dimensions || null) as Product['dimensions'],
    images: (options?.images ?? []).map(image => image.image_url),
    specifications: (product.specifications || {}) as Record<string, string>,
    warranty_months: product.warranty_months,
    active: product.active,
    featured: product.featured,
    status: product.status,
    is_trackable: product.is_trackable,
    category: mapCategory(options?.category),
    brand: mapBrand(options?.brand),
  }
}

export function useProductsService() {
  const { client } = useSupabase()

  const list = async (
    params: PaginationParams & ProductFilters = {},
  ): Promise<PaginatedResponse<Product>> => {
    const page = params.page ?? 1
    const perPage = params.per_page ?? 12
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = client
      .from('products')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)

    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,sku.ilike.%${params.search}%`)
    }

    if (params.category_id) {
      query = query.eq('category_id', params.category_id)
    }

    if (params.brand_id) {
      query = query.eq('brand_id', params.brand_id)
    }

    if (params.status) {
      query = query.eq('active', params.status === 'active')
    }

    if (typeof params.price_min === 'number') {
      query = query.gte('sale_price', params.price_min)
    }

    if (typeof params.price_max === 'number') {
      query = query.lte('sale_price', params.price_max)
    }

    const { data, error, count } = await query
      .order(params.order_by ?? 'created_at', { ascending: params.order_direction === 'asc' })
      .range(from, to)

    assertSupabaseResult(error, 'Não foi possível carregar os produtos')

    const productIds = (data ?? []).map(product => product.id)
    const brandIds = Array.from(new Set((data ?? []).map(product => product.brand_id).filter(Boolean))) as string[]
    const categoryIds = Array.from(new Set((data ?? []).map(product => product.category_id).filter(Boolean))) as string[]

    const [{ data: brands }, { data: categories }, { data: inventoryItems }, { data: productImages }] = await Promise.all([
      brandIds.length
        ? client.from('brands').select('*').in('id', brandIds)
        : Promise.resolve({ data: [], error: null }),
      categoryIds.length
        ? client.from('categories').select('*').in('id', categoryIds)
        : Promise.resolve({ data: [], error: null }),
      productIds.length
        ? client.from('inventory_items').select('*').in('product_id', productIds)
        : Promise.resolve({ data: [], error: null }),
      productIds.length
        ? client.from('product_images').select('*').in('product_id', productIds).order('sort_order', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ])

    const brandMap = new Map((brands ?? []).map(brand => [brand.id, brand]))
    const categoryMap = new Map((categories ?? []).map(category => [category.id, category]))
    const inventoryMap = new Map((inventoryItems ?? []).map(item => [item.product_id, item]))
    const imagesMap = new Map<string, ProductImageRow[]>()

    for (const image of productImages ?? []) {
      const images = imagesMap.get(image.product_id) ?? []
      images.push(image)
      imagesMap.set(image.product_id, images)
    }

    const products = (data ?? []).map(product => mapProduct(product, {
      brand: product.brand_id ? brandMap.get(product.brand_id) : null,
      category: product.category_id ? categoryMap.get(product.category_id) : null,
      inventory: inventoryMap.get(product.id) ?? null,
      images: imagesMap.get(product.id) ?? [],
    }))

    const filteredProducts = params.stock_status
      ? products.filter((product) => {
          if (params.stock_status === 'out_of_stock') return product.stock_quantity === 0
          if (params.stock_status === 'low_stock') return product.stock_quantity > 0 && product.stock_quantity <= product.min_stock
          return product.stock_quantity > product.min_stock
        })
      : products

    return buildPaginatedResponse(filteredProducts, count ?? filteredProducts.length, params)
  }

  const getById = async (id: string) => {
    const { data: product, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    assertSupabaseResult(error, 'Não foi possível carregar o produto')

    const [{ data: brand }, { data: category }, { data: inventory }, { data: images }] = await Promise.all([
      product.brand_id
        ? client.from('brands').select('*').eq('id', product.brand_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      product.category_id
        ? client.from('categories').select('*').eq('id', product.category_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      client.from('inventory_items').select('*').eq('product_id', product.id).maybeSingle(),
      client.from('product_images').select('*').eq('product_id', product.id).order('sort_order', { ascending: true }),
    ])

    return mapProduct(product, {
      brand: brand ?? null,
      category: category ?? null,
      inventory: inventory ?? null,
      images: images ?? [],
    })
  }

  const create = async (input: ProductFormData) => {
    const payload = productFormSchema.parse(input)
    const slug = slugify(payload.name)

    const { data: product, error } = await client
      .from('products')
      .insert({
        name: payload.name,
        slug,
        sku: payload.sku ?? null,
        barcode: payload.barcode ?? null,
        description: payload.description ?? null,
        category_id: payload.category_id ?? null,
        brand_id: payload.brand_id ?? null,
        status: payload.status ?? (payload.active === false ? 'inactive' : 'active'),
        active: payload.active ?? true,
        cost_price: payload.cost ?? null,
        sale_price: payload.price,
        promotional_price: payload.promotional_price ?? null,
        min_stock: payload.min_stock ?? 0,
        max_stock: payload.max_stock ?? null,
        weight: payload.weight ?? null,
        dimensions: payload.dimensions ?? {},
        specifications: payload.specifications ?? {},
        warranty_months: payload.warranty_months ?? null,
        is_trackable: payload.is_trackable ?? false,
        featured: payload.featured ?? false,
      })
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível criar o produto')

    const { error: inventoryError } = await client
      .from('inventory_items')
      .insert({
        product_id: product.id,
        quantity: 0,
        reserved_quantity: 0,
        min_stock: payload.min_stock ?? 0,
        max_stock: payload.max_stock ?? null,
        average_cost: payload.cost ?? null,
      })

    assertSupabaseResult(inventoryError, 'Produto criado, mas o item de estoque não foi inicializado')

    if (payload.images?.length) {
      const { error: imagesError } = await client
        .from('product_images')
        .insert(payload.images.map((imageUrl, index) => ({
          product_id: product.id,
          image_url: imageUrl,
          sort_order: index,
          is_primary: index === 0,
        })))

      assertSupabaseResult(imagesError, 'Produto criado, mas as imagens não foram salvas')
    }

    return getById(product.id)
  }

  const update = async (id: string, input: Partial<ProductFormData>) => {
    const payload = productUpdateSchema.parse(input)

    const { data: product, error } = await client
      .from('products')
      .update({
        name: payload.name,
        slug: payload.name ? slugify(payload.name) : undefined,
        sku: payload.sku,
        barcode: payload.barcode,
        description: payload.description,
        category_id: payload.category_id,
        brand_id: payload.brand_id,
        status: payload.status,
        active: payload.active,
        cost_price: payload.cost,
        sale_price: payload.price,
        promotional_price: payload.promotional_price,
        min_stock: payload.min_stock,
        max_stock: payload.max_stock,
        weight: payload.weight,
        dimensions: payload.dimensions,
        specifications: payload.specifications,
        warranty_months: payload.warranty_months,
        is_trackable: payload.is_trackable,
        featured: payload.featured,
      })
      .eq('id', id)
      .select('*')
      .single()

    assertSupabaseResult(error, 'Não foi possível atualizar o produto')

    if (typeof payload.min_stock === 'number' || typeof payload.max_stock === 'number' || typeof payload.cost === 'number') {
      const { error: inventoryError } = await client
        .from('inventory_items')
        .update({
          min_stock: payload.min_stock,
          max_stock: payload.max_stock,
          average_cost: payload.cost,
        })
        .eq('product_id', id)

      assertSupabaseResult(inventoryError, 'Produto atualizado, mas o estoque não foi sincronizado')
    }

    if (payload.images) {
      const { error: deleteImagesError } = await client
        .from('product_images')
        .delete()
        .eq('product_id', id)

      assertSupabaseResult(deleteImagesError, 'Não foi possível atualizar as imagens do produto')

      if (payload.images.length) {
        const { error: insertImagesError } = await client
          .from('product_images')
          .insert(payload.images.map((imageUrl, index) => ({
            product_id: id,
            image_url: imageUrl,
            sort_order: index,
            is_primary: index === 0,
          })))

        assertSupabaseResult(insertImagesError, 'Não foi possível atualizar as imagens do produto')
      }
    }

    return getById(product.id)
  }

  const changeStatus = async (id: string, status: Product['status']) => {
    const { error } = await client
      .from('products')
      .update({
        status,
        active: status === 'active',
      })
      .eq('id', id)

    assertSupabaseResult(error, 'Não foi possível alterar o status do produto')
    return getById(id)
  }

  const getStats = async (): Promise<ProductStats> => {
    const [{ data: products, error: productsError }, { data: inventoryItems, error: inventoryError }] = await Promise.all([
      client.from('products').select('id, active, cost_price').is('deleted_at', null),
      client.from('inventory_items').select('product_id, quantity, min_stock, average_cost'),
    ])

    assertSupabaseResult(productsError, 'Não foi possível carregar estatísticas de produtos')
    assertSupabaseResult(inventoryError, 'Não foi possível carregar estatísticas de estoque')

    const inventoryMap = new Map((inventoryItems ?? []).map(item => [item.product_id, item]))
    const rows = products ?? []

    const totalValue = rows.reduce((total, product) => {
      const inventory = inventoryMap.get(product.id)
      return total + normalizeCurrencyValue(inventory?.average_cost ?? product.cost_price) * (inventory?.quantity ?? 0)
    }, 0)

    return {
      total: rows.length,
      active: rows.filter(product => product.active).length,
      in_stock: (inventoryItems ?? []).filter(item => item.quantity > item.min_stock).length,
      low_stock: (inventoryItems ?? []).filter(item => item.quantity > 0 && item.quantity <= item.min_stock).length,
      out_of_stock: (inventoryItems ?? []).filter(item => item.quantity === 0).length,
      total_value: totalValue,
    }
  }

  const listBrands = async () => {
    const { data, error } = await client
      .from('brands')
      .select('*')
      .eq('active', true)
      .order('name')

    assertSupabaseResult(error, 'Não foi possível carregar as marcas')
    return (data ?? []).map(brand => mapBrand(brand)!).filter(Boolean)
  }

  const listCategories = async () => {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('sort_order')

    assertSupabaseResult(error, 'Não foi possível carregar as categorias')
    return (data ?? []).map(category => mapCategory(category)!).filter(Boolean)
  }

  return {
    list,
    getById,
    create,
    update,
    changeStatus,
    getStats,
    listBrands,
    listCategories,
  }
}
