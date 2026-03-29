/**
 * 用户相关 API 接口
 * 提供登录、注册、注销、获取和更新用户信息等操作
 */
import request from './index'
import type { ApiResponse } from '@/types/api'
import type { LoginParams, RegisterParams, LoginResult, UserInfo, UpdateProfileParams, UpdatePasswordParams } from '@/types/user'

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
