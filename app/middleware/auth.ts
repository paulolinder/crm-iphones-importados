/**
 * Auth Middleware
 *
 * Middleware para proteger rotas que requerem autenticação.
 * Redireciona para login se o usuário não estiver autenticado.
 */

export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/login', '/forgot-password', '/reset-password']

  if (publicRoutes.includes(to.path)) {
    return
  }

  if (to.path.startsWith('/admin')) {
    const { isAuthenticated, isInitialized, initialize, profile, signOut } = useAuth()

    if (!isInitialized.value) {
      await initialize()
    }

    if (!isAuthenticated.value) {
      return navigateTo('/login', { replace: true })
    }

    if (profile.value?.status === 'blocked') {
      await signOut()
      return navigateTo('/login', { replace: true })
    }
  }
})
