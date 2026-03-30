<script setup lang="ts">
const { whatsappUrl, isConfigured } = useLandingWhatsapp()
const year = new Date().getFullYear()

function goContato(e: MouseEvent) {
  if (isConfigured.value) {
    return
  }
  e.preventDefault()
  document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <footer class="border-t border-zinc-800 bg-zinc-950 text-zinc-100">
    <div class="eleve-container py-12 sm:py-14">
      <div class="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div class="max-w-sm">
          <p class="font-display text-lg font-semibold text-[var(--eleve-ink)]">
            Eleve Imports
          </p>
          <p class="mt-2 text-sm leading-relaxed text-zinc-300">
            Importados com preço justo, atendimento direto e entrega em Campo Novo do Parecis&nbsp;—&nbsp;MT.
          </p>
        </div>
        <div class="text-sm text-zinc-300">
          <p class="font-medium text-white">
            Localização
          </p>
          <p class="mt-2">
            Campo Novo do Parecis — Mato Grosso
          </p>
          <p class="mt-1 text-zinc-400">
            Entrega grátis na cidade.
          </p>
        </div>
        <div class="text-sm">
          <p class="font-medium text-white">
            WhatsApp
          </p>
          <a
            :href="whatsappUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex items-center gap-2 font-medium text-emerald-400 hover:text-emerald-300"
            @click="goContato"
          >
            <Icon name="lucide:message-circle" class="h-4 w-4" />
            Falar conosco
          </a>
        </div>
      </div>
      <div class="mt-12 flex flex-col gap-3 border-t border-zinc-800 pt-8 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} Eleve Imports. Todos os direitos reservados.</p>
        <NuxtLink to="/login" class="hover:text-zinc-200">
          Área do lojista
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
