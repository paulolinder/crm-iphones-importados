<script setup lang="ts">
/**
 * BaseTextarea
 *
 * Componente base de textarea reutilizável
 */

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  rows?: number
  maxLength?: number
  showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  showCount: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => emit('update:modelValue', value),
})

const charCount = computed(() => textValue.value.length)
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>

    <!-- Textarea -->
    <textarea
      v-model="textValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :maxlength="maxLength"
      class="form-textarea"
      :class="{
        'border-danger-500 focus:border-danger-500 focus:ring-danger-500': error,
      }"
    />

    <!-- Footer -->
    <div class="flex items-center justify-between mt-1">
      <div>
        <!-- Error Message -->
        <p v-if="error" class="form-error">{{ error }}</p>
        <!-- Hint -->
        <p v-else-if="hint" class="form-hint">{{ hint }}</p>
      </div>

      <!-- Character Count -->
      <p v-if="showCount" class="text-xs text-slate-400">
        {{ charCount }}{{ maxLength ? `/${maxLength}` : '' }}
      </p>
    </div>
  </div>
</template>
