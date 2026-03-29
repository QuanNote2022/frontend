/**
 * 路由配置文件
 * 定义应用的路由结构和导航守卫
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/storage'

/**
 * 路由配置数组
 */
const routes: RouteRecordRaw[] = [
  // 登录页面
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true, title: '登录' },
  },
  // 注册页面
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { public: true, title: '注册' },
  },
  // 主布局
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    meta: { title: '首页' },
    children: [
      // 首页
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
      },
      // 矿物识别页面
      {
        path: 'detect',
        name: 'MineralDetect',
        component: () => import('@/views/mineral/MineralDetectView.vue'),
        meta: { title: '矿物识别' },
      },
      // 矿物识别详情页面
      {
        path: 'detect/:id',
        name: 'MineralDetail',
        component: () => import('@/views/mineral/MineralDetailView.vue'),
        meta: { title: '识别详情' },
      },
      // 聊天页面
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('@/views/chat/ChatView.vue'),
        meta: { title: '科普问答' },
      },
      // 聊天会话页面
      {
        path: 'chat/:sessionId',
        name: 'ChatSession',
        component: () => import('@/views/chat/ChatView.vue'),
        meta: { title: '科普问答' },
      },
      // 识别历史页面
      {
        path: 'history/detect',
        name: 'DetectHistory',
        component: () => import('@/views/history/DetectHistoryView.vue'),
        meta: { title: '识别历史' },
      },
      // 问答历史页面
      {
        path: 'history/chat',
        name: 'ChatHistory',
        component: () => import('@/views/history/ChatHistoryView.vue'),
        meta: { title: '问答历史' },
      },
      // 个人中心页面
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * 路由守卫
 * 1. 设置页面标题
 * 2. 处理身份验证
 */
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '矿物识别系统'} - 智能矿物识别与科普问答系统`
  
  // 处理身份验证
  const hasToken = getToken()
  
  if (to.meta.public) {
    // 公共页面直接通过
    next()
  } else if (!hasToken) {
    // 未登录用户重定向到登录页
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    // 已登录用户通过
    next()
  }
})

export default router
