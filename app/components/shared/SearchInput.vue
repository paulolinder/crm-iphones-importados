<script setup lang="ts">
/**
 * SearchInput
 *
 * Input de busca com debounce
 */

interface Props {
  modelValue: string
  placeholder?: string
  debounce?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Buscar...',
  debounce: 300,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

const localValue = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout>

watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  localValue.value = value
  emit('update:modelValue', value)

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', value)
  }, props.debounce)
}

const handleClear = () => {
  localValue.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}

onUnmounted(() => {
  clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="relative">
    <!-- Search Icon -->
    <Icon
      name="lucide:search"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
    />

    <!-- Input -->
    <input
      :value="localValue"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      @input="handleInput"
      @keyup.enter="emit('search', localValue)"
    />

    <!-- Loading / Clear -->
    <div class="absolute right-3 top-1/2 -translate-y-1/2">
      <div v-if="loading" class="w-4 h-4 border-2 border-slate-300 border-t-primary-600 rounded-full animate-spin" />
      <button
        v-else-if="localValue"
        type="button"
        class="text-slate-400 hover:text-slate-600"
        @click="handleClear"
      >
        <Icon name="lucide:x" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
