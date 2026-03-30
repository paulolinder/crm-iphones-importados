<script setup lang="ts">
definePageMeta({
  layout: 'site',
})

useHead({
  title: 'Importados com preço justo · Campo Novo do Parecis MT',
  meta: [
    {
      name: 'description',
      content:
        'iPhones, Apple, perfumes, eletrônicos e Starlink com preço justo. Compra por encomenda, produtos originais, entrega grátis em Campo Novo do Parecis — MT. Fale no WhatsApp.',
    },
    {
      property: 'og:title',
      content: 'Eleve Imports — Importados com preço justo',
    },
    {
      property: 'og:description',
      content:
        'Encomenda personalizada, garantia e atendimento direto em Campo Novo do Parecis — MT.',
    },
  ],
})
</script>

<template>
  <div>
    <HeroSection />
    <AboutSection />
    <FeaturesSection />
    <HowItWorksSection />
    <ProductCategoriesSection />
    <GuaranteeSection />
    <LocationSection />
    <CTASection />
  </div>
</template>
