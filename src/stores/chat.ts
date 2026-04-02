/**
 * 聊天状态管理
 * 管理聊天会话、消息和流式生成等
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createSessionApi, getSessionsApi, getSessionMessagesApi, deleteSessionApi, sendMessageUrl } from '@/api/chat'
import { getToken } from '@/utils/storage'
import type { ChatSession, ChatMessage } from '@/types/chat'

/**
 * 聊天状态存储
 */
export const useChatStore = defineStore('chat', () => {
  // 状态
  const sessions = ref<ChatSession[]>([]) // 会话列表
  const currentSessionId = ref<string | null>(null) // 当前会话ID
  const messages = ref<ChatMessage[]>([]) // 消息列表
  const isGenerating = ref(false) // 生成状态
  const streamingContent = ref('') // 流式内容
  const mineralContext = ref<string | null>(null) // 矿物上下文
  let abortController: AbortController | null = null // 用于中断流式请求

  /**
   * 加载会话列表
   */
  async function loadSessions() {
    const res = await getSessionsApi({ page: 1, pageSize: 50 })
    sessions.value = res.data.list
  }

  /**
   * 创建新会话
   * @param mineralName 矿物名称（可选）
   * @returns 新会话信息
   */
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

  /**
   * 切换会话
   * @param sessionId 会话ID
   */
  async function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
    const res = await getSessionMessagesApi(sessionId)
    messages.value = res.data
  }

  /**
   * 发送消息
   * @param content 消息内容
   */
  async function sendMessage(content: string) {
    if (!currentSessionId.value) return

    // 添加用户消息
    const userMsg: ChatMessage = {
      messageId: `user_${Date.now()}`,
      sessionId: currentSessionId.value,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    messages.value.push(userMsg)

    // 添加助手消息（占位）
    const assistantMsg: ChatMessage = {
      messageId: `assistant_${Date.now()}`,
      sessionId: currentSessionId.value,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    }
    messages.value.push(assistantMsg)

    // 开始生成
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

      // 处理流式响应
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
          if (line.startsWith('data:')) {
            try {
              let msgData = line.slice(5)
              console.log('Received SSE data:', msgData);
              const data = JSON.parse(msgData)
              if (data.token) {
                streamingContent.value += data.token
                assistantMsg.content = streamingContent.value
              }
              if (data.done && data.messageId) {
                assistantMsg.messageId = data.messageId
              }
            } catch( error) {
              const err = error as Error;
              console.error('Failed to parse SSE data:', err.message, 'Raw line:', line);
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

  /**
   * 停止生成
   */
  function stopGeneration() {
    if (abortController) {
      abortController.abort()
    }
  }

  /**
   * 删除会话
   * @param sessionId 会话ID
   */
  async function removeSession(sessionId: string) {
    await deleteSessionApi(sessionId)
    sessions.value = sessions.value.filter((s) => s.sessionId !== sessionId)
    if (currentSessionId.value === sessionId) {
      currentSessionId.value = null
      messages.value = []
    }
  }

  /**
   * 设置矿物上下文
   * @param name 矿物名称
   */
  function setMineralContext(name: string | null) {
    mineralContext.value = name
  }

  return {
    sessions, currentSessionId, messages, isGenerating, streamingContent, mineralContext,
    loadSessions, createSession, switchSession, sendMessage, stopGeneration, removeSession, setMineralContext,
  }
})
