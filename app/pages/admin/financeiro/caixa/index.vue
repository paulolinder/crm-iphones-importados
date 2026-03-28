<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Caixa' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Caixa"
      description="Contas de caixa, banco e digital"
      :breadcrumbs="[
        { label: 'Financeiro', to: '/admin/financeiro' },
        { label: 'Caixa' },
      ]"
      :actions="[
        { key: 'tx', label: 'Novo lançamento', icon: 'lucide:plus', variant: 'primary', to: '/admin/financeiro/lancamentos/novo' },
      ]"
    />
    <AdminPlaceholderNotice description="Sincronização com cash_accounts e financial_transactions no Supabase." />
    <div class="grid gap-4 md:grid-cols-3">
      <div
        v-for="row in [
          { n: 'Caixa físico', v: '—', c: 'bg-emerald-50 text-emerald-700' },
          { n: 'Conta bancária', v: '—', c: 'bg-blue-50 text-blue-700' },
          { n: 'PIX / digital', v: '—', c: 'bg-violet-50 text-violet-700' },
        ]"
        :key="row.n"
        class="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
      >
        <p class="text-xs font-semibold text-slate-500 uppercase">
          {{ row.n }}
        </p>
        <p class="mt-2 text-xl font-bold text-slate-900">
          {{ row.v }}
        </p>
        <span class="inline-flex mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full" :class="row.c">Placeholder</span>
      </div>
    </div>
  </div>
</template>
