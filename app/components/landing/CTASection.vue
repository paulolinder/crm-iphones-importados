<template>
  <section id="contato" class="scroll-mt-24 bg-[var(--eleve-ink)] py-16 text-white sm:py-20">
    <div class="eleve-container">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Fale com a gente no WhatsApp
        </h2>
        <p class="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
          Orçamento rápido, encomenda personalizada e atendimento direto — sem call center, sem enrolação.
        </p>
        <ul class="mx-auto mt-8 max-w-md space-y-2 text-left text-sm text-zinc-300">
          <li class="flex items-center gap-2">
            <Icon name="lucide:check" class="h-4 w-4 shrink-0 text-emerald-400" />
            Melhor preço com compra por encomenda
          </li>
          <li class="flex items-center gap-2">
            <Icon name="lucide:check" class="h-4 w-4 shrink-0 text-emerald-400" />
            Você pede o produto; a gente importa
          </li>
          <li class="flex items-center gap-2">
            <Icon name="lucide:check" class="h-4 w-4 shrink-0 text-emerald-400" />
            Resposta humana, aqui da Eleve Imports
          </li>
        </ul>
        <div class="mt-10 flex justify-center">
          <WhatsAppButton variant="inverted" size="lg" label="Abrir WhatsApp" />
        </div>
      </div>
    </div>
  </section>
</template>
