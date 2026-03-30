<script setup lang="ts">
const nav = [
  { label: 'Início', href: '#inicio' },
  { label: 'Produtos', href: '#produtos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Contato', href: '#contato' },
]

const open = ref(false)

function closeMenu() {
  open.value = false
}
</script>

<template>
  <header
    id="inicio"
    class="sticky top-0 z-40 border-b border-zinc-300/80 bg-white/95 shadow-[0_1px_0_rgba(24,24,27,0.05)] backdrop-blur-md"
  >
    <div class="eleve-container flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
      <NuxtLink
        to="/"
        class="font-display text-lg font-semibold tracking-tight text-[var(--eleve-ink)] sm:text-xl"
        @click="closeMenu"
      >
        Eleve Imports
      </NuxtLink>

      <nav class="hidden items-center gap-8 md:flex">
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="text-sm font-medium text-zinc-600 transition-colors hover:text-[var(--eleve-ink)]"
        >
          {{ item.label }}
        </a>
        <NuxtLink
          to="/login"
          class="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800"
        >
          Entrar
        </NuxtLink>
        <WhatsAppButton size="sm" />
      </nav>

      <div class="flex items-center gap-2 md:hidden">
        <WhatsAppButton variant="outline" size="sm" class="!px-3" />
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100"
          aria-label="Abrir menu"
          @click="open = !open"
        >
          <Icon :name="open ? 'lucide:x' : 'lucide:menu'" class="h-6 w-6" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="border-t border-zinc-200 bg-[var(--eleve-surface)] px-4 py-4 md:hidden"
      >
        <a
          v-for="item in nav"
          :key="item.href"
          :href="item.href"
          class="block border-b border-zinc-100 py-3 text-sm font-medium text-zinc-700"
          @click="closeMenu"
        >
          {{ item.label }}
        </a>
        <NuxtLink
          to="/login"
          class="mt-3 block py-2 text-sm font-medium text-zinc-500"
          @click="closeMenu"
        >
          Entrar
        </NuxtLink>
        <div class="mt-4">
          <WhatsAppButton size="md" class="w-full justify-center" />
        </div>
      </div>
    </Transition>
  </header>
</template>
