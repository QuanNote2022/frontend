/**
 * 用户相关 API 接口
 * 提供登录、注册、注销、获取和更新用户信息等操作
 */
import request from './index'
import type { ApiResponse } from '@/types/api'
import type {
  LoginParams,
  RegisterParams,
  LoginResult,
  UserInfo,
  UpdateProfileParams,
  UpdatePasswordParams,
  UserStats,
  LoginDevice,
  LoginHistory,
  UserPreferences,
  Achievement,
  AvatarUploadResult,
  DataExportResult,
} from '@/types/user'

/**
 * 用户登录
 * @param data - 登录参数
 * @returns 返回登录结果，包含 token 和用户信息
 */
export function loginApi(data: LoginParams) {
  return request.post<any, ApiResponse<LoginResult>>('/auth/login', data)
}

/**
 * 用户注册
 * @param data - 注册参数
 * @returns 返回注册结果，包含用户 ID
 */
export function registerApi(data: RegisterParams) {
  return request.post<any, ApiResponse<{ userId: string }>>('/auth/register', data)
}

/**
 * 用户注销
 * @returns 返回注销结果
 */
export function logoutApi() {
  return request.post<any, ApiResponse<null>>('/auth/logout')
}

/**
 * 获取用户个人资料
 * @returns 返回用户个人信息
 */
export function getUserProfileApi() {
  return request.get<any, ApiResponse<UserInfo>>('/user/profile')
}

/**
 * 更新用户个人资料
 * @param data - 更新参数
 * @returns 返回更新后的用户信息
 */
export function updateProfileApi(data: UpdateProfileParams) {
  return request.put<any, ApiResponse<UserInfo>>('/user/profile', data)
}

/**
 * 更新用户密码
 * @param data - 密码更新参数
 * @returns 返回更新结果
 */
export function updatePasswordApi(data: UpdatePasswordParams) {
  return request.put<any, ApiResponse<null>>('/user/password', data)
}

export function getUserStatsApi() {
  return request.get<any, ApiResponse<UserStats>>('/user/stats')
}

export function uploadAvatarApi(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return uploadRequest('/user/avatar', formData) as Promise<ApiResponse<AvatarUploadResult>>
}

export function getLoginDevicesApi() {
  return request.get<any, ApiResponse<LoginDevice[]>>('/user/devices')
}

export function logoutDeviceApi(deviceId: string) {
  return request.delete<any, ApiResponse<null>>(`/user/devices/${deviceId}`)
}

export function getLoginHistoryApi(params: { page: number; pageSize: number }) {
  return request.get<any, ApiResponse<{ list: LoginHistory[]; total: number }>>('/user/login-history', { params })
}

export function getUserPreferencesApi() {
  return request.get<any, ApiResponse<UserPreferences>>('/user/preferences')
}

export function updateUserPreferencesApi(data: Partial<UserPreferences>) {
  return request.put<any, ApiResponse<null>>('/user/preferences', data)
}

export function getUserAchievementsApi() {
  return request.get<any, ApiResponse<Achievement[]>>('/user/achievements')
}

export function exportUserDataApi() {
  return request.post<any, ApiResponse<DataExportResult>>('/user/data/export')
}

export function clearHistoryApi(type: 'detect' | 'chat' | 'all') {
  return request.delete<any, ApiResponse<null>>('/user/history', { data: { type } })
}

export function deleteAccountApi(password: string) {
  return request.delete<any, ApiResponse<null>>('/user/account', { data: { password } })
}
