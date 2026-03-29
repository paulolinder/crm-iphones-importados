/**
 * Feed de atividade do admin — mesma origem que /admin/notificacoes (audit_logs).
 * “Não lidas” = eventos com created_at posterior ao último “marcar como lidas” (localStorage).
 */

const LS_LAST_SEEN = 'crm.admin_activity_feed.last_seen_at'

export type ActivityFeedRow = {
  id: string
  action: string
  entity_type: string
  created_at: string
}

export type ActivityFeedItem = ActivityFeedRow & {
  title: string
  subtitle: string
  icon: string
  read: boolean
}

function iconForEntity(entityType: string, action: string): string {
  const t = `${entityType} ${action}`.toLowerCase()
  if (t.includes('order') || t.includes('pedido') || t.includes('sale') || t.includes('venda')) {
    return 'lucide:shopping-bag'
  }
  if (t.includes('product') || t.includes('produto')) {
    return 'lucide:package'
  }
  if (t.includes('customer') || t.includes('cliente')) {
    return 'lucide:users'
  }
  if (t.includes('stock') || t.includes('estoque') || t.includes('invent')) {
    return 'lucide:boxes'
  }
  if (t.includes('payment') || t.includes('pagamento') || t.includes('finance')) {
    return 'lucide:banknote'
  }
  if (t.includes('delete') || t.includes('remove') || t.includes('exclu')) {
    return 'lucide:trash-2'
  }
  if (t.includes('create') || t.includes('insert') || t.includes('criar') || t.includes('novo')) {
    return 'lucide:plus-circle'
  }
  return 'lucide:activity'
}

export function useAdminActivityFeed() {
  const { client } = useSupabase()
  const { formatRelative } = useDateFormat()

  const rows = ref<ActivityFeedRow[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastSeenAt = ref<string | null>(null)

  const items = computed<ActivityFeedItem[]>(() => {
    const seen = lastSeenAt.value
    const seenMs = seen ? new Date(seen).getTime() : null

    return rows.value.map((row) => {
      const createdMs = new Date(row.created_at).getTime()
      const read = seenMs !== null ? createdMs <= seenMs : false

      return {
        ...row,
        title: `${row.action} · ${row.entity_type}`,
        subtitle: formatRelative(row.created_at),
        icon: iconForEntity(row.entity_type, row.action),
        read,
      }
    })
  })

  const unreadCount = computed(() => items.value.filter(i => !i.read).length)

  function readLastSeenFromStorage() {
    if (import.meta.client) {
      lastSeenAt.value = localStorage.getItem(LS_LAST_SEEN)
    }
  }

  async function load(limit = 12) {
    if (import.meta.server) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: qErr } = await client
        .from('audit_logs')
        .select('id, action, entity_type, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (qErr) {
        error.value = qErr.message
        rows.value = []
        return
      }

      rows.value = (data ?? []) as ActivityFeedRow[]
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar atividade'
      rows.value = []
    }
    finally {
      loading.value = false
    }
  }

  function markAllRead() {
    const now = new Date().toISOString()
    lastSeenAt.value = now
    if (import.meta.client) {
      localStorage.setItem(LS_LAST_SEEN, now)
    }
  }

  onMounted(() => {
    readLastSeenFromStorage()
    void load()
  })

  return {
    items,
    unreadCount,
    loading,
    error,
    load,
    markAllRead,
    readLastSeenFromStorage,
  }
}
