export default defineNuxtRouteMiddleware(async () => {
  const { isInitialized, initialize, hasRole, checkPermission } = useAuth()

  if (!isInitialized.value) {
    await initialize()
  }

  const canAccessAdminArea = hasRole('admin') || checkPermission('settings.manage') || checkPermission('users.manage')

  if (!canAccessAdminArea) {
    return navigateTo('/admin/dashboard', { replace: true })
  }
})
