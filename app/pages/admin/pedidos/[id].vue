<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()

onMounted(() => {
  const raw = route.params.id
  const id = Array.isArray(raw) ? raw[0] : String(raw ?? '')
  void navigateTo(`/admin/vendas/${id}`, { replace: true })
})
</script>

<template>
  <div class="p-8 text-center text-slate-500 text-sm">
    Redirecionando…
  </div>
</template>
