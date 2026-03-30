<script setup lang="ts">
const items = [
  { icon: '💰', title: 'Preço competitivo', text: 'Encomenda costuma sair mais em conta que comprar à vista em loja física.' },
  { icon: '🚚', title: 'Entrega grátis', text: 'Na cidade de Campo Novo do Parecis — MT, sem taxa de entrega.' },
  { icon: '📦', title: 'Trabalhamos por encomenda', text: 'Você escolhe o produto; a gente cuida da importação e do prazo.' },
  { icon: '🔒', title: 'Originais', text: 'Compromisso com produtos autênticos e rastreabilidade quando aplicável.' },
  { icon: '📱', title: 'iPhones lacrados', text: 'Com garantia Apple de 1 ano (conforme regras do fabricante).' },
  { icon: '♻️', title: 'iPhones seminovos', text: 'Garantia Eleve de 30 dias para maior tranquilidade na compra.' },
]
</script>

<template>
  <section class="border-b border-zinc-200/80 bg-white py-16 sm:py-20">
    <div class="eleve-container">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-display text-2xl font-semibold tracking-tight text-[var(--eleve-ink)] sm:text-3xl">
          Por que comprar com a gente
        </h2>
        <p class="mt-3 text-sm text-zinc-600 sm:text-base">
          Diferenciais pensados para quem quer economizar sem abrir mão de segurança.
        </p>
      </div>

      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(item, i) in items"
          :key="i"
          class="rounded-2xl border border-zinc-200/90 bg-[var(--eleve-surface)] px-5 py-6 transition-colors hover:border-zinc-300"
        >
          <p class="text-2xl" aria-hidden="true">
            {{ item.icon }}
          </p>
          <h3 class="mt-3 font-semibold text-[var(--eleve-ink)]">
            {{ item.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">
            {{ item.text }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
