// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt 4 compatibility
  future: {
    compatibilityVersion: 4,
  },

  // App configuration
  app: {
    head: {
      title: 'Eleve Imports - CRM',
      titleTemplate: '%s | Eleve Imports',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Sistema de Gestão para Loja de iPhones e Produtos Importados' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // Source directory (Nuxt 4 convention)
  srcDir: 'app',

  // Server directory
  serverDir: 'server',

  // Modules
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  // CSS
  css: [
    '~/assets/css/main.css',
  ],

  // PostCSS configuration
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false,
    shim: false,
  },

  // Runtime configuration
  runtimeConfig: {
    // Server-side only
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    
    // Public (exposed to client)
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY ?? process.env.SUPABASE_ANON_KEY,
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? 'Eleve Imports CRM',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION ?? '0.1.0',
    },
  },

  // Auto-imports configuration
  imports: {
    dirs: [
      'composables/**',
      'utils/**',
      '../domains/**/composables',
      '../domains/**/services',
    ],
  },

  // Components configuration
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Pinia configuration
  pinia: {
    storesDirs: ['~/stores/**'],
  },

  // Fonts configuration
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },

  // Icon configuration
  icon: {
    size: '24px',
    class: 'icon',
    mode: 'svg',
  },

  // Development tools
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  // Experimental features
  experimental: {
    typedPages: true,
    viewTransition: true,
  },

  // Compatibility date
  compatibilityDate: '2024-11-01',
})
