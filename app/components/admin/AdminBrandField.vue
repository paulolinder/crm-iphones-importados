<script setup lang="ts">
/**
 * Seletor de marca com cadastro rápido no mesmo formulário (ex.: novo produto).
 */

const props = defineProps<{
  modelValue: string
  brands: { id: string; name: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'brand-created': [brand: { id: string; name: string }]
}>()

const service = useProductsService()
const { error: toastError, success: toastSuccess } = useToast()

const showNew = ref(false)
const newBrandName = ref('')
const creating = ref(false)

function onSelectChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === '__new__') {
    ;(event.target as HTMLSelectElement).value = props.modelValue || ''
    showNew.value = true
    nextTick(() => {
      const el = document.getElementById('admin-brand-field-new-name')
      el?.focus()
    })
    return
  }
  emit('update:modelValue', value)
}

function cancelNew() {
  showNew.value = false
  newBrandName.value = ''
}

async function createAndSelect() {
  const name = newBrandName.value.trim()
  if (!name || creating.value) {
    return
  }

  creating.value = true
  try {
    const brand = await service.createBrand({ name })
    emit('brand-created', { id: brand.id, name: brand.name })
    emit('update:modelValue', brand.id)
    toastSuccess('Marca criada', `${brand.name} foi adicionada e selecionada.`)
    cancelNew()
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Não foi possível criar a marca.'
    toastError('Marca', message)
  }
  finally {
    creating.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <label class="form-label">Marca</label>
    <select
      class="form-input"
      :value="modelValue"
      @change="onSelectChange"
    >
      <option value="">
        Selecione
      </option>
      <option
        v-for="brand in brands"
        :key="brand.id"
        :value="brand.id"
      >
        {{ brand.name }}
      </option>
      <option value="__new__" class="font-semibold text-blue-700">
        + Cadastrar nova marca…
      </option>
    </select>

    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showNew"
        class="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-3"
      >
        <p class="text-xs font-medium text-blue-900">
          Nova marca
        </p>
        <input
          id="admin-brand-field-new-name"
          v-model="newBrandName"
          type="text"
          class="form-input bg-white"
          placeholder="Ex.: Chanel, J'adore, Samsung…"
          @keydown.enter.prevent="createAndSelect"
        >
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="btn-primary text-sm py-2 px-4"
            :disabled="creating || !newBrandName.trim()"
            @click="createAndSelect"
          >
            {{ creating ? 'Salvando…' : 'Criar e usar' }}
          </button>
          <button
            type="button"
            class="btn-outline text-sm py-2 px-4"
            :disabled="creating"
            @click="cancelNew"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
