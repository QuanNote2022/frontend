import request from './index'
import type { ApiResponse, PageResult, PageQuery } from '@/types/api'
import type { ChatSession, ChatMessage, FileDocument } from '@/types/chat'

export function createSessionApi(data: { detectId?: string; mineralName?: string }) {
  return request.post<any, ApiResponse<ChatSession>>('/chat/session', data)
}

export function getSessionsApi(params?: PageQuery) {
  return request.get<any, ApiResponse<PageResult<ChatSession>>>('/chat/sessions', { params })
}

export function getSessionMessagesApi(sessionId: string) {
  return request.get<any, ApiResponse<ChatMessage[]>>(`/chat/session/${sessionId}/messages`)
}

export function deleteSessionApi(sessionId: string) {
  return request.delete<any, ApiResponse<null>>(`/chat/session/${sessionId}`)
}

export function sendMessageUrl(sessionId: string): string {
  const base = import.meta.env.VITE_API_BASE_URL || '/api'
  return `${base}/chat/session/${sessionId}/send`
}

export function uploadDocumentApi(sessionId: string, formData: FormData) {
  return request.post<any, ApiResponse<FileDocument>>(`/chat/session/${sessionId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function getSessionDocumentsApi(sessionId: string) {
  return request.get<any, ApiResponse<FileDocument[]>>(`/chat/session/${sessionId}/documents`)
}

export function deleteDocumentApi(sessionId: string, documentId: string) {
  return request.delete<any, ApiResponse<null>>(`/chat/session/${sessionId}/documents/${documentId}`)
}