/**
 * Auth Middleware
 *
 * Middleware para proteger rotas que requerem autenticação.
 * Redireciona para login se o usuário não estiver autenticado.
 */

export default defineNuxtRouteMiddleware(async (to) => {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/forgot-password', '/reset-password']

  if (publicRoutes.includes(to.path)) {
    return
  }

  // Verificar autenticação apenas em rotas admin
  if (to.path.startsWith('/admin')) {
    const { isAuthenticated, isInitialized, initialize } = useAuth()

    // Inicializar auth se necessário
    if (!isInitialized.value) {
      await initialize()
    }

    // Redirecionar para login se não autenticado
    if (!isAuthenticated.value) {
      return navigateTo('/login', { replace: true })
    }
  }
})
