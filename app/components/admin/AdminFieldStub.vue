<script setup lang="ts">
interface Props {
  label: string
  hint?: string
  type?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
})
</script>

<template>
  <div class="space-y-1.5">
    <label class="block text-sm font-medium text-slate-700">{{ label }}</label>
    <input
      :type="type"
      disabled
      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
      :placeholder="hint || '—'"
    >
  </div>
</template>
