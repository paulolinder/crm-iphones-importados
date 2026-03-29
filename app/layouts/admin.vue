<script setup lang="ts">
/**
 * Admin Layout
 *
 * Layout principal do painel administrativo com design premium
 * Inclui sidebar responsiva, header e navegação mobile
 */

const { collapsed, mobileOpen, closeMobile } = useSidebar()

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

watch(mobileOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="mobileOpen && isMobile"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        @click="closeMobile"
      />
    </Transition>

    <!-- Sidebar -->
    <AppSidebar :is-mobile="isMobile" />

    <!-- Main Content Area -->
    <div
      class="transition-all duration-300 ease-out min-h-screen"
      :class="[
        isMobile ? 'ml-0' : (collapsed ? 'lg:ml-20' : 'lg:ml-72'),
      ]"
    >
      <!-- Header -->
      <AppHeader :is-mobile="isMobile" />

      <!-- Page Content -->
      <main class="pt-16 lg:pt-[72px] min-h-screen">
        <slot />
      </main>
    </div>
  </div>
</template>
