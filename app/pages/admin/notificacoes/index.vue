<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Notificações' })

const { client } = useSupabase()

const loading = ref(true)
const err = ref<string | null>(null)
const items = ref<{ id: string; action: string; entity_type: string; created_at: string; metadata: unknown }[]>([])

onMounted(async () => {
  loading.value = true
  try {
    const { data, error } = await client
      .from('audit_logs')
      .select('id, action, entity_type, created_at, metadata')
      .order('created_at', { ascending: false })
      .limit(30)

    if (error) {
      err.value = error.message
      items.value = []
    }
    else {
      items.value = (data ?? []) as typeof items.value
    }
  }
  catch (e) {
    err.value = e instanceof Error ? e.message : 'Erro'
    items.value = []
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Central de notificações"
      description="Últimos eventos do audit log (substitui fila de alertas até haver tabela dedicada)"
      :breadcrumbs="[{ label: 'Notificações' }]"
      :actions="[
        { key: 'settings', label: 'Preferências', icon: 'lucide:settings', variant: 'outline', to: '/admin/configuracoes/notificacoes' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else-if="err" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {{ err }} — verifique permissões RLS em audit_logs.
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
      <div
        v-for="n in items"
        :key="n.id"
        class="px-6 py-4 flex gap-4"
      >
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Icon name="lucide:bell" class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-medium text-slate-900">
            {{ n.action }} · {{ n.entity_type }}
          </p>
          <p class="text-xs text-slate-400 mt-1">
            {{ new Date(n.created_at).toLocaleString() }}
          </p>
        </div>
      </div>
      <div v-if="!items.length" class="px-6 py-10 text-center text-sm text-slate-500">
        Nenhum evento recente.
      </div>
    </div>
  </div>
</template>
