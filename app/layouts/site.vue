<script setup lang="ts">
import '~/assets/css/landing.css'
</script>

<template>
  <div class="site-landing min-h-screen bg-[var(--eleve-surface)]">
    <SiteHeader />
    <main>
      <slot />
    </main>
    <SiteFooter />
    <WhatsAppButton variant="float" label="Falar no WhatsApp — Eleve Imports" />
  </div>
</template>
