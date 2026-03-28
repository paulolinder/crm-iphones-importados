<script setup lang="ts">
/**
 * BaseSelect
 *
 * Componente base de select reutilizável
 */

import type { SelectOption } from '~/types'

interface Props {
  modelValue?: string | number | null
  options: SelectOption[]
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione...',
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const selectValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>

    <!-- Select -->
    <select
      v-model="selectValue"
      :disabled="disabled"
      :required="required"
      class="form-select"
      :class="{
        'border-danger-500 focus:border-danger-500 focus:ring-danger-500': error,
        'text-slate-400': !selectValue,
      }"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Error Message -->
    <p v-if="error" class="form-error">{{ error }}</p>

    <!-- Hint -->
    <p v-else-if="hint" class="form-hint">{{ hint }}</p>
  </div>
</template>
