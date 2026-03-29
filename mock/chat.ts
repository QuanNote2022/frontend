import type { MockHandler } from './index'
import { mineralData } from './mineral'

const sessions: Array<{
  sessionId: string
  title: string
  mineralName: string
  messageCount: number
  lastActiveAt: string
  createdAt: string
  messages: Array<{ messageId: string; role: 'user' | 'assistant'; content: string; createdAt: string }>
}> = []

function getKnowledge(name: string): string {
  const info = mineralData.find((m) => m.name === name)
  if (!info) {
    return `关于${name}，这是一种矿物。矿物是自然界中具有一定化学组成和晶体结构的固体无机物。如果您想了解更多，请告诉我您感兴趣的方面。`
  }
  return `## ${info.name}（${info.formula}）

**基本特征：**
- **硬度：** ${info.hardness}（莫氏硬度）
- **光泽：** ${info.luster}
- **颜色：** ${info.color}

**简介：**
${info.description}

**主要产地：** ${info.origin}

**用途：** ${info.uses}

如果您想深入了解${info.name}的某个方面，比如晶体结构、形成条件或鉴定方法，请继续提问！`
}

const chat: MockHandler[] = [
  {
    url: '/api/chat/session',
    method: 'post',
    handler: (body) => {
      const session = {
        sessionId: 'sess_' + Date.now(),
        title: body?.mineralName ? `关于${body.mineralName}的问答` : '新的对话',
        mineralName: body?.mineralName || '',
        messageCount: 0,
        lastActiveAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        messages: [] as any[],
      }
      sessions.unshift(session)
      return { code: 200, message: 'success', data: session }
    },
  },
  {
    url: '/api/chat/sessions',
    method: 'get',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        list: sessions.map(({ messages: _m, ...rest }) => rest),
        total: sessions.length,
        page: 1,
        pageSize: 50,
      },
    }),
  },
  {
    url: '/api/chat/session/',
    method: 'get',
    matchPrefix: true,
    handler: (_body, url) => {
      if (url?.includes('/messages')) {
        const sessionId = url.split('/').slice(-2)[0]
        const session = sessions.find((s) => s.sessionId === sessionId)
        return {
          code: 200,
          message: 'success',
          data: session?.messages || [],
        }
      }
      return { code: 200, message: 'success', data: [] }
    },
  },
  {
    url: '/api/chat/session/',
    method: 'delete',
    matchPrefix: true,
    handler: (_body, url) => {
      const sessionId = url?.split('/').pop()
      const idx = sessions.findIndex((s) => s.sessionId === sessionId)
      if (idx !== -1) sessions.splice(idx, 1)
      return { code: 200, message: 'success', data: null }
    },
  },
  {
    url: '/api/chat/session/',
    method: 'post',
    matchPrefix: true,
    isSSE: true,
    handler: (body, url) => {
      const parts = url?.split('/') || []
      const sendIdx = parts.indexOf('send')
      const sessionId = sendIdx > 0 ? parts[sendIdx - 1] : ''
      const session = sessions.find((s) => s.sessionId === sessionId)

      const userContent = body?.content || ''
      const mineralName = body?.mineralContext || session?.mineralName || ''

      if (session) {
        session.messages.push({
          messageId: 'msg_' + Date.now(),
          role: 'user',
          content: userContent,
          createdAt: new Date().toISOString(),
        })
      }

      let responseText: string
      if (mineralName) {
        if (userContent.includes('产地') || userContent.includes('哪里')) {
          const info = mineralData.find((m) => m.name === mineralName)
          responseText = `${mineralName}的主要产地包括：${info?.origin || '全球多个地区'}。不同产地的${mineralName}在品质和特征上可能存在差异。`
        } else if (userContent.includes('用途') || userContent.includes('做什么')) {
          const info = mineralData.find((m) => m.name === mineralName)
          responseText = `${mineralName}的主要用途：${info?.uses || '工业和科研领域'}`
        } else {
          responseText = getKnowledge(mineralName)
        }
      } else {
        responseText = '您好！我是矿物科普智能助手。您可以上传矿物图片进行识别，或者直接向我提问关于矿物的问题。我可以帮您了解矿物的特性、产地、用途等信息。'
      }

      const msgId = 'msg_' + Date.now() + '_assistant'
      if (session) {
        session.messages.push({
          messageId: msgId,
          role: 'assistant',
          content: responseText,
          createdAt: new Date().toISOString(),
        })
        session.messageCount = session.messages.length
      }

      return { text: responseText, messageId: msgId }
    },
  },
]

export default chat
