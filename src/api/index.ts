/**
 * API 接口请求配置
 * 封装 Axios 实例，添加请求和响应拦截器
 */
import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from '@/utils/storage'
import router from '@/router'
import type { ApiResponse } from '@/types/api'

/**
 * 创建 Axios 实例
 * @description 配置基础 URL 和超时时间
 */
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // API 基础 URL
  timeout: 30000, // 请求超时时间
})

/**
 * 请求拦截器
 * @description 为请求添加认证 token
 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 获取本地存储的 token
    const token = getToken()
    // 如果 token 存在，添加到请求头
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * 响应拦截器
 * @description 统一处理响应数据和错误
 */
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data
    // 检查响应状态码
    if (res.code !== 200) {
      // 显示错误消息
      ElMessage.error(res.message || '请求失败')
      // 处理未授权错误
      if (res.code === 401) {
        removeToken()
        router.push('/login')
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    // 返回响应数据
    return res as any
  },
  (error) => {
    // 处理网络错误
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

// 导出 Axios 实例
export default service

/**
 * 文件上传请求
 * @param url - 上传接口地址
 * @param formData - 表单数据，包含文件
 * @param onProgress - 上传进度回调函数
 * @returns 返回上传请求的 Promise
 */
export function uploadRequest(url: string, formData: FormData, onProgress?: (percent: number) => void) {
  return service.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // 设置内容类型为表单数据
    timeout: 60000, // 上传超时时间
    onUploadProgress: (e) => {
      // 计算上传进度并调用回调
      if (e.total && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    },
  })
}
