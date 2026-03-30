<script setup lang="ts">
const highlights = [
  'Entrega grátis em Campo Novo do Parecis — MT',
  'Produtos originais',
  'Garantia conforme o produto',
  'Compra por encomenda',
]
</script>

<template>
  <section class="border-b border-zinc-200/80 bg-white">
    <div class="eleve-container py-16 sm:py-20 lg:py-28">
      <div class="mx-auto max-w-3xl text-center">
        <h1 class="font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[var(--eleve-ink)] sm:text-4xl lg:text-[2.75rem]">
          iPhones, eletrônicos e importados com preço justo
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
          Compre com segurança e clareza. Atendemos Campo Novo do Parecis — MT, com foco em originais e encomenda sob medida.
        </p>

        <ul class="mx-auto mt-8 flex max-w-lg flex-col gap-2.5 text-left sm:mx-auto sm:max-w-md">
          <li
            v-for="(line, i) in highlights"
            :key="i"
            class="flex items-start gap-2.5 text-sm text-zinc-700 sm:text-[0.9375rem]"
          >
            <Icon name="lucide:check" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{{ line }}</span>
          </li>
        </ul>

        <div class="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <LandingWhatsAppButton size="lg" />
          <a
            href="#produtos"
            class="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-base font-semibold text-zinc-800 transition-colors hover:bg-zinc-50"
          >
            Ver produtos
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
