import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createSessionApi, getSessionsApi, getSessionMessagesApi, deleteSessionApi, sendMessageUrl } from '@/api/chat'
import { getToken } from '@/utils/storage'
import type { ChatSession, ChatMessage } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])
  const isGenerating = ref(false)
  const streamingContent = ref('')
  const mineralContext = ref<string | null>(null)
  let abortController: AbortController | null = null

  async function loadSessions() {
    const res = await getSessionsApi({ page: 1, pageSize: 50 })
    sessions.value = res.data.list
  }

  async function createSession(mineralName?: string) {
    const res = await createSessionApi({ mineralName })
    sessions.value.unshift(res.data)
    currentSessionId.value = res.data.sessionId
    messages.value = []
    if (mineralName) {
      mineralContext.value = mineralName
    }
    return res.data
  }

  async function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
    const res = await getSessionMessagesApi(sessionId)
    messages.value = res.data
  }

  async function sendMessage(content: string) {
    if (!currentSessionId.value) return

    const userMsg: ChatMessage = {
      messageId: `user_${Date.now()}`,
      sessionId: currentSessionId.value,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    messages.value.push(userMsg)

    const assistantMsg: ChatMessage = {
      messageId: `assistant_${Date.now()}`,
      sessionId: currentSessionId.value,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    }
    messages.value.push(assistantMsg)

    isGenerating.value = true
    streamingContent.value = ''
    abortController = new AbortController()

    try {
      const url = sendMessageUrl(currentSessionId.value)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content, mineralContext: mineralContext.value }),
        signal: abortController.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('请求失败')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.token) {
                streamingContent.value += data.token
                assistantMsg.content = streamingContent.value
              }
              if (data.done && data.messageId) {
                assistantMsg.messageId = data.messageId
              }
            } catch {
              // skip invalid JSON
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        assistantMsg.content = streamingContent.value + '\n\n[已停止生成]'
      } else {
        assistantMsg.content = '抱歉，请求出错了，请稍后重试。'
      }
    } finally {
      isGenerating.value = false
      streamingContent.value = ''
      abortController = null
    }
  }

  function stopGeneration() {
    if (abortController) {
      abortController.abort()
    }
  }

  async function removeSession(sessionId: string) {
    await deleteSessionApi(sessionId)
    sessions.value = sessions.value.filter((s) => s.sessionId !== sessionId)
    if (currentSessionId.value === sessionId) {
      currentSessionId.value = null
      messages.value = []
    }
  }

  function setMineralContext(name: string | null) {
    mineralContext.value = name
  }

  return {
    sessions, currentSessionId, messages, isGenerating, streamingContent, mineralContext,
    loadSessions, createSession, switchSession, sendMessage, stopGeneration, removeSession, setMineralContext,
  }
})
