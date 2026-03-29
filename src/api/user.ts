import request from './index'
import type { ApiResponse } from '@/types/api'
import type { LoginParams, RegisterParams, LoginResult, UserInfo, UpdateProfileParams, UpdatePasswordParams } from '@/types/user'

export function loginApi(data: LoginParams) {
  return request.post<any, ApiResponse<LoginResult>>('/auth/login', data)
}

export function registerApi(data: RegisterParams) {
  return request.post<any, ApiResponse<{ userId: string }>>('/auth/register', data)
}

export function logoutApi() {
  return request.post<any, ApiResponse<null>>('/auth/logout')
}

export function getUserProfileApi() {
  return request.get<any, ApiResponse<UserInfo>>('/user/profile')
}

export function updateProfileApi(data: UpdateProfileParams) {
  return request.put<any, ApiResponse<UserInfo>>('/user/profile', data)
}

export function updatePasswordApi(data: UpdatePasswordParams) {
  return request.put<any, ApiResponse<null>>('/user/password', data)
}
