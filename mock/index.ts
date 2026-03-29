import type { Plugin } from 'vite'
import userMocks from './user'
import mineralMocks from './mineral'
import chatMocks from './chat'
import historyMocks from './history'

export interface MockHandler {
  url: string
  method: 'get' | 'post' | 'put' | 'delete'
  handler: (body?: any, url?: string, query?: Record<string, string>) => any
  matchPrefix?: boolean
  isSSE?: boolean
}

const allMocks: MockHandler[] = [...userMocks, ...mineralMocks, ...chatMocks, ...historyMocks]

function parseQuery(url: string): Record<string, string> {
  const idx = url.indexOf('?')
  if (idx === -1) return {}
  const params = new URLSearchParams(url.slice(idx + 1))
  const result: Record<string, string> = {}
  params.forEach((v, k) => {
    result[k] = v
  })
  return result
}

export function mockServerPlugin(): Plugin {
  return {
    name: 'vite-plugin-mock-server',
    configureServer(server) {
      // Use 'pre' style: return middleware from configureServer so it runs before Vite's own middleware
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url || ''
          const pathname = url.split('?')[0]
          const method = (req.method || 'get').toLowerCase()

          const mock = allMocks.find((m) => {
            if (m.method !== method) return false
            if (m.matchPrefix) return pathname.startsWith(m.url)
            return pathname === m.url
          })

          if (!mock) return next()

          let body: any = {}
          if (method === 'post' || method === 'put') {
            body = await new Promise<any>((resolve) => {
              const chunks: Buffer[] = []
              req.on('data', (chunk: Buffer) => {
                chunks.push(chunk)
              })
              req.on('end', () => {
                const raw = Buffer.concat(chunks).toString('utf-8')
                try {
                  resolve(raw ? JSON.parse(raw) : {})
                } catch {
                  resolve({})
                }
              })
              // Safety timeout: resolve with empty body after 3s if no data events fire
              setTimeout(() => resolve({}), 3000)
            })
          }

          const query = parseQuery(url)

          if (mock.isSSE) {
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
              'Access-Control-Allow-Origin': '*',
            })

            const result = mock.handler(body, pathname, query)
            const text: string = result.text || ''
            const messageId: string = result.messageId || 'msg_mock'
            const chars = text.split('')
            let i = 0

            const interval = setInterval(() => {
              if (i < chars.length) {
                res.write(`data: ${JSON.stringify({ token: chars[i], done: false })}\n\n`)
                i++
              } else {
                res.write(`data: ${JSON.stringify({ token: '', done: true, messageId })}\n\n`)
                clearInterval(interval)
                res.end()
              }
            }, 30)

            req.on('close', () => {
              clearInterval(interval)
            })
            return
          }

          // Simulate network delay
          await new Promise((r) => setTimeout(r, 200 + Math.random() * 300))

          const result = mock.handler(body, pathname, query)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result))
        })
      }
    },
  }
}
