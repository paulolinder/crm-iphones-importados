<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Pedidos' })

onMounted(() => {
  void navigateTo('/admin/vendas', { replace: true })
})
</script>

<template>
  <div class="p-8 text-center text-slate-500 text-sm">
    Redirecionando para vendas…
  </div>
</template>
