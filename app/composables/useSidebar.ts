/**
 * useSidebar
 *
 * Composable para controle do sidebar com suporte mobile
 */

const sidebarState = reactive({
  collapsed: false,
  mobileOpen: false,
})

export function useSidebar() {
  const collapsed = computed(() => sidebarState.collapsed)
  const mobileOpen = computed(() => sidebarState.mobileOpen)

  const toggle = () => {
    sidebarState.collapsed = !sidebarState.collapsed
  }

  const collapse = () => {
    sidebarState.collapsed = true
  }

  const expand = () => {
    sidebarState.collapsed = false
  }

  const toggleMobile = () => {
    sidebarState.mobileOpen = !sidebarState.mobileOpen
  }

  const openMobile = () => {
    sidebarState.mobileOpen = true
  }

  const closeMobile = () => {
    sidebarState.mobileOpen = false
  }

  // Fechar mobile ao mudar de rota
  const route = useRoute()
  watch(() => route.path, () => {
    closeMobile()
  })

  return {
    collapsed,
    mobileOpen,
    toggle,
    collapse,
    expand,
    toggleMobile,
    openMobile,
    closeMobile,
  }
}
