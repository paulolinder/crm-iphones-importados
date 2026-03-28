<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()

const handleError = () => {
  clearError({ redirect: '/' })
}

const errorTitle = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Página não encontrada'
    case 403:
      return 'Acesso negado'
    case 500:
      return 'Erro interno do servidor'
    default:
      return 'Ocorreu um erro'
  }
})

const errorMessage = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'A página que você está procurando não existe ou foi movida.'
    case 403:
      return 'Você não tem permissão para acessar este recurso.'
    case 500:
      return 'Houve um problema no servidor. Tente novamente mais tarde.'
    default:
      return props.error.message || 'Algo deu errado. Tente novamente.'
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <div class="mb-8">
        <span class="text-8xl font-bold text-primary-600">
          {{ error.statusCode }}
        </span>
      </div>

      <h1 class="text-2xl font-bold text-slate-900 mb-2">
        {{ errorTitle }}
      </h1>

      <p class="text-slate-600 mb-8">
        {{ errorMessage }}
      </p>

      <div class="flex items-center justify-center gap-4">
        <button
          class="btn-primary"
          @click="handleError"
        >
          <Icon name="lucide:home" class="w-4 h-4" />
          Voltar ao início
        </button>

        <button
          class="btn-outline"
          @click="$router.back()"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Voltar
        </button>
      </div>

      <div v-if="error.statusCode === 500 && error.message" class="mt-8">
        <details class="text-left">
          <summary class="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
            Detalhes técnicos
          </summary>
          <pre class="mt-2 p-4 bg-slate-100 rounded-lg text-xs text-slate-700 overflow-auto">{{ error.message }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>
