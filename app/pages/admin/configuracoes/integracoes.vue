<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Integrações — Configurações' })
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Integrações"
      description="APIs e serviços externos"
      :breadcrumbs="[
        { label: 'Configurações', to: '/admin/configuracoes' },
        { label: 'Integrações' },
      ]"
    />
    <div class="rounded-xl border border-amber-100 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 space-y-2">
      <p>
        Chaves secretas (Supabase, gateways de pagamento, provedores de e-mail) devem ficar apenas em <strong>variáveis de ambiente</strong> no servidor (.env / painel do host), nunca commitadas no repositório.
      </p>
      <p>
        Variáveis já usadas neste projeto: <code class="text-xs bg-white/60 px-1 rounded">NUXT_PUBLIC_SUPABASE_URL</code>, <code class="text-xs bg-white/60 px-1 rounded">NUXT_PUBLIC_SUPABASE_ANON_KEY</code>, <code class="text-xs bg-white/60 px-1 rounded">SUPABASE_SERVICE_KEY</code> (servidor), etc.
      </p>
    </div>
  </div>
</template>
