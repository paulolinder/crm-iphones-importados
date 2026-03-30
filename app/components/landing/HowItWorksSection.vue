<script setup lang="ts">
const steps = [
  { n: '1', title: 'Você escolhe', text: 'Envia o modelo ou pede sugestão — também importamos o que não está no catálogo.' },
  { n: '2', title: 'Faz a encomenda', text: 'Combinamos valores, prazo e forma de pagamento com total transparência.' },
  { n: '3', title: 'Importamos', text: 'Cuidamos da aquisição com fornecedores confiáveis.' },
  { n: '4', title: 'Prazo médio', text: 'Em torno de 15 dias — pode variar conforme o produto e disponibilidade.' },
  { n: '5', title: 'Entrega', text: 'Receba em Campo Novo do Parecis — MT, com entrega grátis na cidade.' },
]
</script>

<template>
  <section id="como-funciona" class="scroll-mt-24 border-b border-zinc-200/80 bg-[var(--eleve-surface)] py-16 sm:py-20">
    <div class="eleve-container">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-display text-2xl font-semibold tracking-tight text-[var(--eleve-ink)] sm:text-3xl">
          Como funciona a compra por encomenda
        </h2>
        <p class="mt-3 text-sm text-zinc-600 sm:text-base">
          Simples, direto e sem surpresas. Na dúvida, chame no WhatsApp.
        </p>
      </div>

      <ol class="mx-auto mt-12 max-w-3xl space-y-0">
        <li
          v-for="(step, i) in steps"
          :key="i"
          class="relative flex gap-4 border-l border-zinc-200 pb-10 pl-8 last:border-l-0 last:pb-0 sm:gap-6 sm:pl-10"
        >
          <span
            class="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-bold text-zinc-800 sm:-left-3.5 sm:h-7 sm:w-7 sm:text-sm"
          >
            {{ step.n }}
          </span>
          <div>
            <h3 class="font-semibold text-[var(--eleve-ink)]">
              {{ step.title }}
            </h3>
            <p class="mt-1.5 text-sm leading-relaxed text-zinc-600">
              {{ step.text }}
            </p>
          </div>
        </li>
      </ol>

      <div class="mx-auto mt-10 max-w-xl rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-5 py-4 text-center text-sm text-emerald-950">
        <strong class="font-semibold">Lembrete:</strong> encomenda costuma sair mais barata que loja;
        você pode pedir <strong class="font-semibold">qualquer produto</strong> dentro do que importamos.
      </div>
    </div>
  </section>
</template>
