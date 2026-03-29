export function formatDate(date: string | Date, fmt = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  const map: Record<string, number> = {
    YYYY: d.getFullYear(),
    MM: d.getMonth() + 1,
    DD: d.getDate(),
    HH: d.getHours(),
    mm: d.getMinutes(),
    ss: d.getSeconds(),
  }
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) =>
    String(map[match]).padStart(2, '0')
  )
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%'
}
