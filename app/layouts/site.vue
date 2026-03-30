<script setup lang="ts">
import '~/assets/css/landing.css'
</script>

<template>
  <div class="site-landing min-h-screen bg-[var(--eleve-surface)]">
    <LandingSiteHeader />
    <main>
      <slot />
    </main>
    <LandingSiteFooter />
    <LandingWhatsAppButton variant="float" label="Falar no WhatsApp — Eleve Imports" />
  </div>
</template>
