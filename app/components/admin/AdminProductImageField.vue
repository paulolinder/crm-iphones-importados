<script setup lang="ts">
/**
 * Foto do produto: URL externa ou upload (bucket product_images).
 */
const url = defineModel<string>('url', { default: '' })
const file = defineModel<File | null>('file', { default: null })

const emit = defineEmits<{
  interacted: []
}>()

const mode = ref<'url' | 'upload'>('url')

const fileInputRef = ref<HTMLInputElement | null>(null)
const blobPreview = ref<string | null>(null)

watch(
  file,
  (f) => {
    if (blobPreview.value) {
      URL.revokeObjectURL(blobPreview.value)
      blobPreview.value = null
    }
    if (f) {
      blobPreview.value = URL.createObjectURL(f)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (blobPreview.value) {
    URL.revokeObjectURL(blobPreview.value)
  }
})

function setMode(next: 'url' | 'upload') {
  mode.value = next
  if (next === 'url') {
    file.value = null
  }
  else {
    url.value = ''
  }
}

function onUrlInput() {
  emit('interacted')
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0] ?? null
  file.value = f
  emit('interacted')
  if (!f) {
    input.value = ''
  }
}

function clearFile() {
  file.value = null
  emit('interacted')
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const previewSrc = computed(() => {
  if (mode.value === 'upload' && blobPreview.value) {
    return blobPreview.value
  }
  const u = url.value.trim()
  if (mode.value === 'url' && u && /^https?:\/\//i.test(u)) {
    return u
  }
  return null
})
</script>

<template>
  <div class="md:col-span-2 space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <label class="form-label mb-0">Foto do produto</label>
      <div class="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium">
        <button
          type="button"
          class="rounded-md px-3 py-1.5 transition-colors"
          :class="mode === 'url' ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-50'"
          @click="setMode('url')"
        >
          URL da imagem
        </button>
        <button
          type="button"
          class="rounded-md px-3 py-1.5 transition-colors"
          :class="mode === 'upload' ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-50'"
          @click="setMode('upload')"
        >
          Enviar arquivo
        </button>
      </div>
    </div>

    <div v-if="mode === 'url'" class="space-y-2">
      <input
        v-model="url"
        type="url"
        class="form-input"
        placeholder="https://exemplo.com/imagem.jpg"
        inputmode="url"
        autocomplete="off"
        @input="onUrlInput"
      >
      <p class="text-xs text-slate-500">
        Cole o link direto da imagem (terminando em .jpg, .png, etc.).
      </p>
    </div>

    <div v-else class="space-y-2">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-800 hover:file:bg-primary-100"
        @change="onFileChange"
      >
      <p class="text-xs text-slate-500">
        JPG, PNG, WebP ou GIF · até 5 MB · fica no seu Supabase (bucket <code class="text-[11px]">product_images</code>).
      </p>
      <button
        v-if="file"
        type="button"
        class="text-xs font-medium text-red-600 hover:text-red-700"
        @click="clearFile"
      >
        Remover arquivo
      </button>
    </div>

    <div
      v-if="previewSrc"
      class="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white"
    >
      <p class="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Pré-visualização
      </p>
      <div class="flex justify-center p-4">
        <img
          :src="previewSrc"
          alt="Prévia do produto"
          class="max-h-48 max-w-full object-contain"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        >
      </div>
    </div>
  </div>
</template>
