<script setup lang="ts">
/**
 * Atalhos fixos no rodapé (mobile) para fluxo de balcão: menos cliques até venda e cliente.
 */
const route = useRoute()

const visible = computed(
  () => route.path.startsWith('/admin') && !route.path.startsWith('/admin/login'),
)

const items = [
  { to: '/admin/dashboard', icon: 'lucide:layout-dashboard', label: 'Início' },
  { to: '/admin/vendas', icon: 'lucide:shopping-cart', label: 'Vendas' },
  { to: '/admin/pedidos/novo', icon: 'lucide:plus-circle', label: 'Novo' },
  { to: '/admin/clientes', icon: 'lucide:users', label: 'Clientes' },
] as const
</script>

<template>
  <nav
    v-if="visible"
    class="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.12)]"
    style="padding-bottom: max(0.35rem, env(safe-area-inset-bottom, 0px))"
    aria-label="Atalhos do balcão"
  >
    <ul class="mx-auto flex max-w-lg items-stretch justify-around gap-0.5 px-1 pt-1">
      <li v-for="item in items" :key="item.to" class="min-w-0 flex-1">
        <NuxtLink
          :to="item.to"
          class="flex min-h-[3.25rem] min-w-[3rem] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold text-slate-600 transition-colors active:bg-slate-100"
          active-class="!text-primary-700 bg-primary-50/90"
        >
          <Icon :name="item.icon" class="h-6 w-6 shrink-0 opacity-90" />
          <span class="truncate">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
