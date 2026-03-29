/**
 * 格式化工具函数
 * 提供日期、文件大小和百分比的格式化功能
 */

/**
 * 格式化日期
 * @param date 日期对象或日期字符串
 * @param fmt 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
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

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * 格式化百分比
 * @param value 小数形式的百分比（例如 0.75 表示 75%）
 * @returns 格式化后的百分比字符串
 */
export function formatPercent(value: number): string {
  return (value * 100).toFixed(1) + '%'
}
