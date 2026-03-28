<script setup lang="ts">
/**
 * BaseInput
 *
 * Componente base de input reutilizável
 */

interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  iconPosition: 'left',
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  'clear': []
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value as string | number),
})

const showClear = computed(() => props.clearable && inputValue.value)

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Left Icon -->
      <Icon
        v-if="icon && iconPosition === 'left'"
        :name="icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
      />

      <!-- Input -->
      <input
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        class="form-input"
        :class="{
          'pl-10': icon && iconPosition === 'left',
          'pr-10': (icon && iconPosition === 'right') || showClear,
          'border-danger-500 focus:border-danger-500 focus:ring-danger-500': error,
        }"
      />

      <!-- Right Icon or Clear -->
      <div
        v-if="(icon && iconPosition === 'right') || showClear"
        class="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <button
          v-if="showClear"
          type="button"
          class="text-slate-400 hover:text-slate-600"
          @click="handleClear"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
        <Icon
          v-else-if="icon"
          :name="icon"
          class="w-5 h-5 text-slate-400"
        />
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="form-error">{{ error }}</p>

    <!-- Hint -->
    <p v-else-if="hint" class="form-hint">{{ hint }}</p>
  </div>
</template>
