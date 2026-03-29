/**
 * 用户相关类型定义
 */

/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户ID */
  userId: string
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 头像 */
  avatar: string
  /** 昵称 */
  nickname: string
  /** 创建时间 */
  createdAt: string
}

/**
 * 登录参数接口
 */
export interface LoginParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/**
 * 注册参数接口
 */
export interface RegisterParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 邮箱 */
  email: string
}

/**
 * 登录结果接口
 */
export interface LoginResult {
  /** 认证令牌 */
  token: string
  /** 过期时间（秒） */
  expiresIn: number
}

/**
 * 更新用户信息参数接口
 */
export interface UpdateProfileParams {
  /** 邮箱（可选） */
  email?: string
  /** 头像（可选） */
  avatar?: string
  /** 昵称（可选） */
  nickname?: string
}

/**
 * 更新密码参数接口
 */
export interface UpdatePasswordParams {
  /** 旧密码 */
  oldPassword: string
  /** 新密码 */
  newPassword: string
}
