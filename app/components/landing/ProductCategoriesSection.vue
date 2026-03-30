<script setup lang="ts">
const categories = [
  { title: 'iPhones', desc: 'Lacrados e seminovos', icon: 'lucide:smartphone' },
  { title: 'Perfumes', desc: 'Importados selecionados', icon: 'lucide:sparkles' },
  { title: 'Eletrônicos', desc: 'Gadgets e tecnologia', icon: 'lucide:cpu' },
  { title: 'Apple', desc: 'Ecossistema completo', icon: 'lucide:apple' },
  { title: 'Starlink', desc: 'Internet via satélite', icon: 'lucide:satellite' },
  { title: 'Acessórios', desc: 'Cases, cabos e mais', icon: 'lucide:plug-zap' },
]
</script>

<template>
  <section id="produtos" class="scroll-mt-24 border-b border-zinc-300/80 bg-[var(--eleve-surface)] py-16 sm:py-20">
    <div class="eleve-container">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-display text-2xl font-semibold tracking-tight text-[var(--eleve-ink)] sm:text-3xl">
          Categorias
        </h2>
        <p class="mt-3 text-sm text-zinc-700 sm:text-base">
          Um panorama do que mais pedem — valores e disponibilidade respondemos no WhatsApp.
        </p>
      </div>

      <div class="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="(cat, i) in categories"
          :key="i"
          class="group flex items-start gap-4 rounded-2xl border border-zinc-300/80 bg-zinc-50/80 px-5 py-5 transition-colors hover:border-zinc-400 hover:bg-white"
        >
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-200/70 text-zinc-800 transition-colors group-hover:bg-zinc-200">
            <Icon :name="cat.icon" class="h-5 w-5" />
          </div>
          <div>
            <h3 class="font-semibold text-[var(--eleve-ink)]">
              {{ cat.title }}
            </h3>
            <p class="mt-1 text-sm text-zinc-700">
              {{ cat.desc }}
            </p>
          </div>
        </article>
      </div>

      <p class="mx-auto mt-10 max-w-lg text-center text-sm text-zinc-500">
        Catálogo e promoções atualizadas sob consulta — fale com a gente.
      </p>
    </div>
  </section>
</template>
