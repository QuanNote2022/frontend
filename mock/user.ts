import type { MockHandler } from './index'

const users: MockHandler[] = [
  {
    url: '/api/auth/login',
    method: 'post',
    handler: (body) => {
      if (body?.username && body?.password) {
        return {
          code: 200,
          message: 'success',
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            expiresIn: 86400,
          },
        }
      }
      return { code: 400, message: '用户名或密码错误', data: null }
    },
  },
  {
    url: '/api/auth/register',
    method: 'post',
    handler: () => ({
      code: 200,
      message: '注册成功',
      data: { userId: 'user_' + Date.now() },
    }),
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    handler: () => ({ code: 200, message: 'success', data: null }),
  },
  {
    url: '/api/user/profile',
    method: 'get',
    handler: () => ({
      code: 200,
      message: 'success',
      data: {
        userId: 'user_001',
        username: 'demo',
        email: 'demo@example.com',
        avatar: '',
        nickname: '矿物爱好者',
        createdAt: '2026-01-15T08:00:00.000Z',
      },
    }),
  },
  {
    url: '/api/user/profile',
    method: 'put',
    handler: (body) => ({
      code: 200,
      message: 'success',
      data: {
        userId: 'user_001',
        username: 'demo',
        email: body?.email || 'demo@example.com',
        avatar: body?.avatar || '',
        nickname: body?.nickname || '矿物爱好者',
        createdAt: '2026-01-15T08:00:00.000Z',
      },
    }),
  },
  {
    url: '/api/user/password',
    method: 'put',
    handler: () => ({ code: 200, message: '密码修改成功', data: null }),
  },
]

export default users
