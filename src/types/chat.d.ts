export interface ChatSession {
  sessionId: string
  title: string
  mineralName?: string
  messageCount: number
  lastActiveAt: string
  createdAt: string
}

export interface ChatMessage {
  messageId: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  documentIds?: string[]
  documents?: FileDocument[]
}

export interface SendMessageParams {
  content: string
  mineralContext?: string
  documentIds?: string[]
}

export interface SSEToken {
  token: string
  done: boolean
  messageId?: string
}

export interface FileDocument {
  documentId: string
  sessionId: string
  userId: string
  fileName: string
  fileUrl: string
  fileType: string
  status: number
  createdAt: string
}