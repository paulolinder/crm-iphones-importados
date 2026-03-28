<script setup lang="ts">
/**
 * Página inicial - Redireciona para login ou dashboard
 */

definePageMeta({
  layout: false,
})

const { isAuthenticated, isInitialized } = useAuth()

onMounted(() => {
  if (isInitialized.value) {
    navigateTo(isAuthenticated.value ? '/admin/dashboard' : '/login')
  }
})

watch(isInitialized, (initialized) => {
  if (initialized) {
    navigateTo(isAuthenticated.value ? '/admin/dashboard' : '/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <div class="loading-spinner" />
  </div>
</template>
