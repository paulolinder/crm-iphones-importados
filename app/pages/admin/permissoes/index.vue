<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Permissões' })

const matrix = [
  { module: 'Clientes', keys: ['customers.read', 'customers.create', 'customers.update', 'customers.delete'] },
  { module: 'Produtos', keys: ['products.read', 'products.create', 'products.update', 'products.delete'] },
  { module: 'Estoque', keys: ['inventory.read', 'inventory.update'] },
  { module: 'Vendas', keys: ['orders.read', 'orders.create', 'orders.update'] },
  { module: 'Financeiro', keys: ['finance.read', 'finance.update'] },
  { module: 'Sistema', keys: ['settings.manage', 'users.manage', 'reports.read'] },
]

const roles = ['admin', 'manager', 'seller', 'inventory', 'finance', 'support']
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Permissões"
      description="Visão simplificada das chaves em `permissions` e papéis em `roles`"
      :breadcrumbs="[{ label: 'Permissões' }]"
      :actions="[
        { key: 'users', label: 'Usuários', icon: 'lucide:users', variant: 'outline', to: '/admin/usuarios' },
      ]"
    />
    <AdminPlaceholderNotice description="Edição granular será feita com checkboxes por role quando o módulo de administração de acessos estiver completo." />
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
      <table class="w-full text-xs min-w-[640px]">
        <thead>
          <tr class="bg-slate-50/80 text-left text-slate-500 uppercase font-semibold">
            <th class="px-4 py-3 sticky left-0 bg-slate-50/95 backdrop-blur">
              Módulo / chave
            </th>
            <th v-for="r in roles" :key="r" class="px-2 py-3 text-center">
              {{ r }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <template v-for="block in matrix" :key="block.module">
            <tr class="bg-slate-50/40">
              <td colspan="7" class="px-4 py-2 font-semibold text-slate-800 text-sm">
                {{ block.module }}
              </td>
            </tr>
            <tr v-for="key in block.keys" :key="key">
              <td class="px-4 py-2 font-mono text-slate-700 sticky left-0 bg-white">
                {{ key }}
              </td>
              <td v-for="r in roles" :key="r" class="px-2 py-2 text-center text-slate-300">
                <Icon
                  :name="r === 'admin' ? 'lucide:check' : 'lucide:minus'"
                  class="w-4 h-4 mx-auto"
                  :class="r === 'admin' ? 'text-emerald-500' : ''"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
