export default defineAppConfig({
  // Application metadata
  app: {
    name: 'Eleve Imports CRM',
    description: 'Sistema de Gestão para Loja de iPhones e Produtos Importados',
    version: '0.1.0',
  },

  // UI Theme configuration
  ui: {
    // Primary brand colors
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
      success: {
        light: '#22c55e',
        DEFAULT: '#16a34a',
        dark: '#15803d',
      },
      warning: {
        light: '#facc15',
        DEFAULT: '#eab308',
        dark: '#ca8a04',
      },
      danger: {
        light: '#f87171',
        DEFAULT: '#ef4444',
        dark: '#dc2626',
      },
      info: {
        light: '#38bdf8',
        DEFAULT: '#0ea5e9',
        dark: '#0284c7',
      },
    },

    // Border radius tokens
    radius: {
      none: '0',
      sm: '0.25rem',
      DEFAULT: '0.5rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      full: '9999px',
    },

    // Shadow tokens
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },

    // Spacing tokens
    spacing: {
      page: '1.5rem',
      section: '1.5rem',
      card: '1.25rem',
      gap: '1rem',
    },

    // Component defaults
    components: {
      card: {
        padding: '1.25rem',
        radius: '0.75rem',
        shadow: 'sm',
      },
      button: {
        radius: '0.5rem',
      },
      input: {
        radius: '0.5rem',
      },
      badge: {
        radius: '9999px',
      },
      modal: {
        radius: '0.75rem',
      },
    },
  },

  // Sidebar configuration
  sidebar: {
    width: '280px',
    collapsedWidth: '80px',
    defaultCollapsed: false,
  },

  // Table defaults
  table: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },

  // Date format
  dateFormat: {
    short: 'dd/MM/yyyy',
    long: "dd 'de' MMMM 'de' yyyy",
    datetime: 'dd/MM/yyyy HH:mm',
    time: 'HH:mm',
  },

  // Currency format
  currency: {
    code: 'BRL',
    locale: 'pt-BR',
    symbol: 'R$',
  },
})
