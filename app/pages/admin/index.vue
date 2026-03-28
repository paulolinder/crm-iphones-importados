<script setup lang="ts">
/**
 * Redireciona /admin para /admin/dashboard
 */

definePageMeta({
  layout: 'admin',
})

onMounted(() => {
  navigateTo('/admin/dashboard')
})
</script>

<template>
  <div class="p-6">
    <LoadingState text="Carregando..." />
  </div>
</template>
