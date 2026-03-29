/**
 * 存储工具函数
 * 提供token的本地存储操作
 */

/**
 * token存储键名
 */
const TOKEN_KEY = 'mineral_token'

/**
 * 获取token
 * @returns token字符串或null
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * 设置token
 * @param token token字符串
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * 移除token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
