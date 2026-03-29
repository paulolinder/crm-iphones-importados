function escapeCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function downloadCsv(filename: string, headers: string[], rows: Record<string, unknown>[]) {
  const lines = [
    headers.map(escapeCell).join(','),
    ...rows.map(row => headers.map(h => escapeCell(row[h])).join(',')),
  ]
  const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
