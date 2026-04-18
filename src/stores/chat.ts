import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createSessionApi, getSessionsApi, getSessionMessagesApi, deleteSessionApi, sendMessageUrl, uploadDocumentApi, getSessionDocumentsApi, deleteDocumentApi } from '@/api/chat'
import { getToken } from '@/utils/storage'
import type { ChatSession, ChatMessage, FileDocument } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const messages = ref<ChatMessage[]>([])
  const isGenerating = ref(false)
  const isLoadingSessions = ref(false)
  const streamingContent = ref('')
  const mineralContext = ref<string | null>(null)
  const uploadedDocuments = ref<FileDocument[]>([])
  let abortController: AbortController | null = null

  async function loadSessions() {
    isLoadingSessions.value = true
    try {
      const res = await getSessionsApi({ page: 1, pageSize: 50 })
      sessions.value = res.data.list
    } finally {
      isLoadingSessions.value = false
    }
  }

  async function createSession(mineralName?: string) {
    const res = await createSessionApi({ mineralName })
    sessions.value.unshift(res.data)
    currentSessionId.value = res.data.sessionId
    messages.value = []
    uploadedDocuments.value = []
    if (mineralName) {
      mineralContext.value = mineralName
    }
    return res.data
  }

  async function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
    const res = await getSessionMessagesApi(sessionId)
    messages.value = res.data
    await loadSessionDocuments(sessionId)
  }

  async function loadSessionDocuments(sessionId: string) {
    try {
      const res = await getSessionDocumentsApi(sessionId)
      uploadedDocuments.value = res.data
    } catch {
      uploadedDocuments.value = []
    }
  }

  async function uploadDocument(file: File) {
    if (!currentSessionId.value) return null
    const formData = new FormData()
    formData.append('file', file)
    const res = await uploadDocumentApi(currentSessionId.value, formData)
    uploadedDocuments.value.push(res.data)
    return res.data
  }

  async function removeDocument(docId: string) {
    if (!currentSessionId.value) return
    await deleteDocumentApi(currentSessionId.value, docId)
    uploadedDocuments.value = uploadedDocuments.value.filter(d => d.documentId !== docId)
  }

  async function sendMessage(content: string) {
    if (!currentSessionId.value) return

    const documentIds = uploadedDocuments.value.map(d => d.documentId)
    const currentDocs = uploadedDocuments.value.length > 0 ? [...uploadedDocuments.value] : undefined

    const userMsg: ChatMessage = {
      messageId: `user_${Date.now()}`,
      sessionId: currentSessionId.value,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      documentIds: documentIds.length > 0 ? documentIds : undefined,
      documents: currentDocs,
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
        body: JSON.stringify({ content, mineralContext: mineralContext.value, documentIds }),
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
            } catch(error) {
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

  function stopGeneration() {
    if (abortController) {
      abortController.abort()
    }
  }

  async function regenerate() {
    if (!currentSessionId.value || isGenerating.value) return

    const messagesList = messages.value
    if (messagesList.length < 2) return

    const lastUserMsgIndex = messagesList.length - 2
    const lastUserMsg = messagesList[lastUserMsgIndex]

    if (lastUserMsg.role !== 'user') return

    messages.value = messages.value.slice(0, lastUserMsgIndex + 1)

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

    const documentIds = lastUserMsg.documentIds || uploadedDocuments.value.map(d => d.documentId)

    try {
      const url = sendMessageUrl(currentSessionId.value)
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ 
          content: lastUserMsg.content, 
          mineralContext: mineralContext.value, 
          documentIds 
        }),
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
          if (line.startsWith('data:')) {
            try {
              let msgData = line.slice(5)
              const data = JSON.parse(msgData)
              if (data.token) {
                streamingContent.value += data.token
                assistantMsg.content = streamingContent.value
              }
              if (data.done && data.messageId) {
                assistantMsg.messageId = data.messageId
              }
            } catch(error) {
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

  async function removeSession(sessionId: string) {
    await deleteSessionApi(sessionId)
    sessions.value = sessions.value.filter((s) => s.sessionId !== sessionId)
    if (currentSessionId.value === sessionId) {
      currentSessionId.value = null
      messages.value = []
      uploadedDocuments.value = []
    }
  }

  function setMineralContext(name: string | null) {
    mineralContext.value = name
  }

  return {
    sessions, currentSessionId, messages, isGenerating, isLoadingSessions, streamingContent, mineralContext, uploadedDocuments,
    loadSessions, createSession, switchSession, loadSessionDocuments, uploadDocument, removeDocument, sendMessage, stopGeneration, regenerate, removeSession, setMineralContext,
  }
})