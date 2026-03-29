<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Notificações — Configurações' })

const settings = useAppSettingsService()
const { success, error: toastError } = useToast()

const KEY = 'notifications.prefs'

const prefs = reactive({
  low_stock_email: false,
  new_sale_push: false,
  backup_reminder: false,
})

const loading = ref(true)
const saving = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const raw = await settings.getByKey(KEY)
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const o = raw as Record<string, unknown>
      prefs.low_stock_email = Boolean(o.low_stock_email)
      prefs.new_sale_push = Boolean(o.new_sale_push)
      prefs.backup_reminder = Boolean(o.backup_reminder)
    }
  }
  catch {
    /* ignore */
  }
  finally {
    loading.value = false
  }
})

async function save() {
  saving.value = true
  try {
    await settings.saveByKey(KEY, { ...prefs }, 'Preferências de notificação')
    success('Salvo', 'Preferências gravadas em app_settings.')
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao salvar')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Notificações"
      description="Persistido em app_settings (chave notifications.prefs)"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Notificações' },
      ]"
      :actions="[
        { key: 'save', label: 'Salvar preferências', icon: 'lucide:save', variant: 'primary', onClick: save },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
      <div
        v-for="row in [
          { k: 'low_stock_email' as const, t: 'Estoque baixo', d: 'E-mail quando SKU abaixo do mínimo' },
          { k: 'new_sale_push' as const, t: 'Nova venda', d: 'Alerta interno ao confirmar pedido' },
          { k: 'backup_reminder' as const, t: 'Backup', d: 'Lembrete semanal de exportação' },
        ]"
        :key="row.k"
        class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <p class="text-sm font-medium text-slate-900">
            {{ row.t }}
          </p>
          <p class="text-xs text-slate-500">
            {{ row.d }}
          </p>
        </div>
        <label class="inline-flex items-center gap-2 cursor-pointer">
          <input v-model="prefs[row.k]" type="checkbox" class="rounded border-slate-300">
          <span class="text-xs text-slate-600">Ativo</span>
        </label>
      </div>
    </div>
  </div>
</template>
