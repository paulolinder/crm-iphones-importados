<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Permissões' })

const svc = usePermissionsMatrixService()
const { success, error: toastError } = useToast()

const loading = ref(true)
const roles = ref<{ id: string; name: string; slug: string }[]>([])
const permissions = ref<{ id: string; permission_key: string; description: string | null }[]>([])
const linkSet = ref<Set<string>>(new Set())

const load = async () => {
  loading.value = true
  try {
    const m = await svc.loadMatrix()
    roles.value = m.roles
    permissions.value = m.permissions
    linkSet.value = new Set(m.links.map(l => `${l.role_id}:${l.permission_id}`))
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao carregar')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})

function hasLink(roleId: string, permissionId: string) {
  return linkSet.value.has(`${roleId}:${permissionId}`)
}

async function toggle(roleId: string, permissionId: string) {
  const key = `${roleId}:${permissionId}`
  const enabled = linkSet.value.has(key)
  try {
    await svc.setPermission(roleId, permissionId, !enabled)
    if (enabled) {
      linkSet.value.delete(key)
    }
    else {
      linkSet.value.add(key)
    }
    success(enabled ? 'Permissão removida' : 'Permissão atribuída', '')
  }
  catch (e) {
    toastError('Erro', e instanceof Error ? e.message : 'Falha ao atualizar')
  }
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Permissões"
      description="Matriz roles × permissions (tabelas role_permissions)"
      :breadcrumbs="[{ label: 'Permissões' }]"
      :actions="[
        { key: 'users', label: 'Usuários', icon: 'lucide:users', variant: 'outline', to: '/admin/usuarios' },
      ]"
    />
    <div v-if="loading" class="text-sm text-slate-500 py-8">
      Carregando…
    </div>
    <div v-else class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
      <table class="w-full text-xs min-w-[720px]">
        <thead>
          <tr class="bg-slate-50/80 text-left text-slate-500 uppercase font-semibold">
            <th class="px-4 py-3 sticky left-0 bg-slate-50/95 backdrop-blur z-10 min-w-[200px]">
              Permissão
            </th>
            <th v-for="r in roles" :key="r.id" class="px-2 py-3 text-center min-w-[72px]">
              <span class="block truncate max-w-[88px]" :title="r.slug">{{ r.name }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="p in permissions" :key="p.id">
            <td class="px-4 py-2 font-mono text-[11px] text-slate-700 sticky left-0 bg-white z-10">
              <span class="block">{{ p.permission_key }}</span>
              <span v-if="p.description" class="text-slate-400 font-sans normal-case">{{ p.description }}</span>
            </td>
            <td v-for="r in roles" :key="r.id" class="px-1 py-1 text-center">
              <button
                type="button"
                class="w-8 h-8 rounded-lg border text-sm flex items-center justify-center mx-auto transition-colors"
                :class="hasLink(r.id, p.id) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-300 hover:border-slate-300'"
                :title="hasLink(r.id, p.id) ? 'Remover' : 'Adicionar'"
                @click="toggle(r.id, p.id)"
              >
                <Icon :name="hasLink(r.id, p.id) ? 'lucide:check' : 'lucide:minus'" class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
