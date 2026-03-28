<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Importar produtos' })

const { info: toastInfo } = useToast()

function onChooseFileClick() {
  toastInfo('Upload em desenvolvimento', 'Seleção de arquivo e validação em massa serão habilitadas em breve.')
}
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">
    <AppPageHeader
      title="Importar produtos"
      description="Upload de planilha CSV/XLSX para carga em massa"
      :breadcrumbs="[
        { label: 'Produtos', to: '/admin/produtos' },
        { label: 'Importar' },
      ]"
      :actions="[
        { key: 'template', label: 'Baixar modelo', icon: 'lucide:file-spreadsheet', variant: 'outline' },
        { key: 'list', label: 'Ver catálogo', variant: 'ghost', to: '/admin/produtos' },
      ]"
    />
    <AdminPlaceholderNotice description="O processamento validará SKU, preços e vínculo com categorias antes de gravar no Supabase." />
    <div class="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center space-y-4">
      <Icon name="lucide:upload-cloud" class="w-12 h-12 text-slate-300 mx-auto" />
      <p class="text-sm text-slate-600">
        Arraste um arquivo ou clique para selecionar (em breve).
      </p>
      <button
        type="button"
        class="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 text-slate-600"
        @click="onChooseFileClick"
      >
        Escolher arquivo
      </button>
    </div>
  </div>
</template>
