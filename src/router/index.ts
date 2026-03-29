import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/storage'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true, title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { public: true, title: '注册' },
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'detect',
        name: 'MineralDetect',
        component: () => import('@/views/mineral/MineralDetectView.vue'),
        meta: { title: '矿物识别' },
      },
      {
        path: 'detect/:id',
        name: 'MineralDetail',
        component: () => import('@/views/mineral/MineralDetailView.vue'),
        meta: { title: '识别详情' },
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/chat/ChatView.vue'),
        meta: { title: '科普问答' },
      },
      {
        path: 'chat/:sessionId',
        name: 'ChatSession',
        component: () => import('@/views/chat/ChatView.vue'),
        meta: { title: '科普问答' },
      },
      {
        path: 'history/detect',
        name: 'DetectHistory',
        component: () => import('@/views/history/DetectHistoryView.vue'),
        meta: { title: '识别历史' },
      },
      {
        path: 'history/chat',
        name: 'ChatHistory',
        component: () => import('@/views/history/ChatHistoryView.vue'),
        meta: { title: '问答历史' },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '矿物识别系统'} - 智能矿物识别与科普问答系统`
  if (to.meta.public) {
    next()
  } else if (!getToken()) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
