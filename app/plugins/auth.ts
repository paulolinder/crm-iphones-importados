/**
 * Auth Plugin
 *
 * Inicializa a autenticação ao carregar a aplicação
 */

export default defineNuxtPlugin(async () => {
  const { initialize, isInitialized } = useAuth()

  if (!isInitialized.value) {
    await initialize()
  }
})
