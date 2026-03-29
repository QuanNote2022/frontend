/**
 * 用户状态管理
 * 管理用户登录状态、个人信息等
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, logoutApi, getUserProfileApi, updateProfileApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/storage'
import router from '@/router'
import type { UserInfo, LoginParams, UpdateProfileParams } from '@/types/user'

/**
 * 用户状态存储
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string | null>(getToken())
  const userInfo = ref<UserInfo | null>(null)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)

  /**
   * 登录
   * @param params 登录参数
   * @returns 登录结果
   */
  async function login(params: LoginParams) {
    const res = await loginApi(params)
    token.value = res.data.token
    setToken(res.data.token)
    return res
  }

  /**
   * 登出
   */
  async function logout() {
    try {
      await logoutApi()
    } finally {
      token.value = null
      userInfo.value = null
      removeToken()
      router.push('/login')
    }
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    if (!token.value) return
    const res = await getUserProfileApi()
    userInfo.value = res.data
  }

  /**
   * 更新用户信息
   * @param data 更新数据
   */
  async function updateProfile(data: UpdateProfileParams) {
    const res = await updateProfileApi(data)
    userInfo.value = res.data
  }

  return { token, userInfo, isLoggedIn, login, logout, fetchUserInfo, updateProfile }
})
