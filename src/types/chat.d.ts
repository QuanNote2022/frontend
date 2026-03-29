/**
 * 聊天相关类型定义
 */

/**
 * 聊天会话接口
 */
export interface ChatSession {
  /** 会话ID */
  sessionId: string
  /** 会话标题 */
  title: string
  /** 矿物名称（可选） */
  mineralName?: string
  /** 消息数量 */
  messageCount: number
  /** 最后活跃时间 */
  lastActiveAt: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  /** 消息ID */
  messageId: string
  /** 会话ID */
  sessionId: string
  /** 角色 */
  role: 'user' | 'assistant'
  /** 消息内容 */
  content: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 发送消息参数接口
 */
export interface SendMessageParams {
  /** 消息内容 */
  content: string
  /** 矿物上下文（可选） */
  mineralContext?: string
}

/**
 * SSE token接口
 */
export interface SSEToken {
  /** 令牌内容 */
  token: string
  /** 是否完成 */
  done: boolean
  /** 消息ID（可选） */
  messageId?: string
}
