<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Importar produtos' })

const products = useProductsService()
const { success, error: toastError, info: toastInfo } = useToast()

const fileInput = ref<HTMLInputElement | null>(null)
const busy = ref(false)

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (!lines.length) {
    return []
  }
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? ''
    })
    rows.push(row)
  }
  return rows
}

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }
  busy.value = true
  let ok = 0
  let fail = 0
  try {
    const text = await file.text()
    const rows = parseCsv(text)
    if (!rows.length) {
      toastInfo('Arquivo vazio', 'Nenhuma linha de dados após o cabeçalho.')
      return
    }
    for (const r of rows) {
      const name = (r.name || r.nome || '').trim()
      const price = Number.parseFloat(String(r.price || r.preco || '0').replace(',', '.'))
      if (!name || Number.isNaN(price) || price < 0) {
        fail++
        continue
      }
      try {
        await products.create({
          name,
          sku: (r.sku || '').trim() || undefined,
          price,
          category_id: (r.category_id || '').trim() || undefined,
          brand_id: (r.brand_id || '').trim() || undefined,
          status: 'active',
          active: true,
        })
        ok++
      }
      catch {
        fail++
      }
    }
    success('Importação concluída', `${ok} criados, ${fail} ignorados ou com erro.`)
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao processar')
  }
  finally {
    busy.value = false
    input.value = ''
  }
}

function downloadTemplate() {
  const csv = 'name,price,sku,category_id,brand_id\nExemplo Produto,99.90,SKU-1,,\n'
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'modelo-produtos.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Importar produtos"
      description="CSV com colunas: name (ou nome), price (ou preco), sku, category_id, brand_id"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Importar' },
      ]"
      :actions="[
        { key: 'template', label: 'Baixar modelo', icon: 'lucide:file-spreadsheet', variant: 'outline', onClick: downloadTemplate },
        { key: 'list', label: 'Ver catálogo', variant: 'ghost', to: '/admin/produtos' },
      ]"
    />
    <div class="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center space-y-4">
      <Icon name="lucide:upload-cloud" class="w-12 h-12 text-slate-300 mx-auto" />
      <p class="text-sm text-slate-600">
        Cada linha cria um produto via <code class="text-xs bg-slate-100 px-1 rounded">products.create</code> (estoque inicial zero salvo se informado no fluxo de edição).
      </p>
      <input
        ref="fileInput"
        type="file"
        accept=".csv,text/csv"
        class="hidden"
        @change="onFile"
      >
      <button
        type="button"
        class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white disabled:opacity-50"
        :disabled="busy"
        @click="fileInput?.click()"
      >
        {{ busy ? 'Processando…' : 'Escolher arquivo CSV' }}
      </button>
    </div>
  </div>
</template>
