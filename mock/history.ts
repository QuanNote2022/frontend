import type { MockHandler } from './index'
import { mineralData } from './mineral'

function randomDate(daysAgo: number): string {
  const now = Date.now()
  const past = now - Math.random() * daysAgo * 86400000
  return new Date(past).toISOString()
}

const mockDetections = Array.from({ length: 35 }, (_, i) => {
  const m = mineralData[i % mineralData.length]
  return {
    detectId: `det_hist_${i}`,
    imageUrl: '',
    results: [
      {
        label: m.name,
        confidence: +(0.78 + Math.random() * 0.2).toFixed(2),
        bbox: [50, 40, 160, 160] as [number, number, number, number],
        mineralInfo: m,
      },
    ],
    createdAt: randomDate(60),
  }
}).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

const mockChatRecords = Array.from({ length: 20 }, (_, i) => {
  const m = mineralData[i % mineralData.length]
  return {
    sessionId: `sess_hist_${i}`,
    title: `关于${m.name}的问答`,
    mineralName: m.name,
    messageCount: Math.floor(Math.random() * 10) + 2,
    lastActiveAt: randomDate(30),
    createdAt: randomDate(60),
  }
}).sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime())

const frequencyData = mineralData.map((m) => ({
  mineralName: m.name,
  count: Math.floor(Math.random() * 50) + 5,
}))

const history: MockHandler[] = [
  {
    url: '/api/history/detections',
    method: 'get',
    handler: (_body, _url, query) => {
      const page = Number(query?.page) || 1
      const pageSize = Number(query?.pageSize) || 10
      const keyword = query?.keyword || ''
      let filtered = mockDetections
      if (keyword) {
        filtered = filtered.filter((d) => d.results.some((r) => r.label.includes(keyword)))
      }
      const start = (page - 1) * pageSize
      return {
        code: 200,
        message: 'success',
        data: {
          list: filtered.slice(start, start + pageSize),
          total: filtered.length,
          page,
          pageSize,
        },
      }
    },
  },
  {
    url: '/api/history/detections/',
    method: 'delete',
    matchPrefix: true,
    handler: () => ({ code: 200, message: 'success', data: null }),
  },
  {
    url: '/api/history/chats',
    method: 'get',
    handler: (_body, _url, query) => {
      const page = Number(query?.page) || 1
      const pageSize = Number(query?.pageSize) || 10
      const start = (page - 1) * pageSize
      return {
        code: 200,
        message: 'success',
        data: {
          list: mockChatRecords.slice(start, start + pageSize),
          total: mockChatRecords.length,
          page,
          pageSize,
        },
      }
    },
  },
  {
    url: '/api/stats/overview',
    method: 'get',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        totalDetections: mockDetections.length,
        totalChats: mockChatRecords.length,
        topMineral: '石英',
        weeklyActiveDays: 5,
      },
    }),
  },
  {
    url: '/api/stats/mineral-frequency',
    method: 'get',
    handler: () => ({
      code: 200,
      message: 'success',
      data: frequencyData,
    }),
  },
]

export default history
