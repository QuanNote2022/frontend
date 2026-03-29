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
}

export interface SendMessageParams {
  content: string
  mineralContext?: string
}

export interface SSEToken {
  token: string
  done: boolean
  messageId?: string
}
