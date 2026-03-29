import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, logoutApi, getUserProfileApi, updateProfileApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/storage'
import router from '@/router'
import type { UserInfo, LoginParams, UpdateProfileParams } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(getToken())
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(params: LoginParams) {
    const res = await loginApi(params)
    token.value = res.data.token
    setToken(res.data.token)
    return res
  }

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

  async function fetchUserInfo() {
    if (!token.value) return
    const res = await getUserProfileApi()
    userInfo.value = res.data
  }

  async function updateProfile(data: UpdateProfileParams) {
    const res = await updateProfileApi(data)
    userInfo.value = res.data
  }

  return { token, userInfo, isLoggedIn, login, logout, fetchUserInfo, updateProfile }
})
