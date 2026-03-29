/**
 * 聊天相关 API 接口
 * 提供聊天会话的创建、获取、删除等操作
 */
import request from './index'
import type { ApiResponse, PageResult, PageQuery } from '@/types/api'
import type { ChatSession, ChatMessage } from '@/types/chat'

/**
 * 创建聊天会话
 * @param data - 会话创建参数
 * @param data.detectId - 识别记录 ID（可选）
 * @param data.mineralName - 矿物名称（可选）
 * @returns 返回创建的会话信息
 */
export function createSessionApi(data: { detectId?: string; mineralName?: string }) {
  return request.post<any, ApiResponse<ChatSession>>('/chat/session', data)
}

/**
 * 获取聊天会话列表
 * @param params - 分页参数
 * @returns 返回会话列表
 */
export function getSessionsApi(params?: PageQuery) {
  return request.get<any, ApiResponse<PageResult<ChatSession>>>('/chat/sessions', { params })
}

/**
 * 获取会话消息记录
 * @param sessionId - 会话 ID
 * @returns 返回会话的消息列表
 */
export function getSessionMessagesApi(sessionId: string) {
  return request.get<any, ApiResponse<ChatMessage[]>>(`/chat/session/${sessionId}/messages`)
}

/**
 * 删除聊天会话
 * @param sessionId - 会话 ID
 * @returns 返回删除结果
 */
export function deleteSessionApi(sessionId: string) {
  return request.delete<any, ApiResponse<null>>(`/chat/session/${sessionId}`)
}

/**
 * 获取发送消息的 API 地址
 * @param sessionId - 会话 ID
 * @returns 返回发送消息的 API 地址
 */
export function sendMessageUrl(sessionId: string): string {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${base}/chat/session/${sessionId}/send`
}
