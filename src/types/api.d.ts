/**
 * API相关类型定义
 */

/**
 * API响应接口
 * @template T 数据类型
 */
export interface ApiResponse<T = unknown> {
  /** 状态码 */
  code: number
  /** 消息 */
  message: string
  /** 数据 */
  data: T
}

/**
 * 分页结果接口
 * @template T 数据类型
 */
export interface PageResult<T> {
  /** 数据列表 */
  list: T[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * 全局搜索结果
 */
export interface SearchResult {
  minerals: import('./mineral').MineralInfo[]
  sessions: import('./chat').ChatSession[]
}

/**
 * 分页查询接口
 */
export interface PageQuery {
  /** 页码（可选） */
  page?: number
  /** 每页大小（可选） */
  pageSize?: number
}
