/**
 * usePermissions
 *
 * Helpers reativos para checagem de permissões e papéis.
 */

export function usePermissions() {
  const { permissions, roles, checkPermission, hasRole, isAuthenticated } = useAuth()

  const permissionKeys = computed(() => permissions.value.map(permission => permission.permission_key))
  const roleSlugs = computed(() => roles.value.map(role => role.slug))
  const isAdmin = computed(() => hasRole('admin'))

  const can = (permissionKey: string) => {
    return isAuthenticated.value && checkPermission(permissionKey)
  }

  const canSome = (requestedPermissions: string[]) => {
    return requestedPermissions.some(permissionKey => can(permissionKey))
  }

  const canEvery = (requestedPermissions: string[]) => {
    return requestedPermissions.every(permissionKey => can(permissionKey))
  }

  return {
    permissions,
    roles,
    permissionKeys,
    roleSlugs,
    isAdmin,
    can,
    canSome,
    canEvery,
    hasRole,
  }
}
