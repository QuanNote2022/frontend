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

/**
 * 用户统计数据接口 - 新增
 */
export interface UserStats {
  /** 总识别次数 */
  totalDetections: number
  /** 总问答次数 */
  totalChats: number
  /** 活跃天数 */
  activeDays: number
  /** 连续登录天数 */
  consecutiveDays: number
  /** 最常识别的矿物 */
  topMineral: string
  /** 识别矿物种类数 */
  mineralTypes: number
  /** 本周活动数据 */
  weeklyActivity: number[]
  /** 本月活动数据 */
  monthlyActivity: number[]
}

/**
 * 登录设备信息接口 - 新增
 */
export interface LoginDevice {
  /** 设备ID */
  deviceId: string
  /** 设备名称 */
  deviceName: string
  /** 设备类型 */
  deviceType: 'desktop' | 'mobile' | 'tablet'
  /** 操作系统 */
  os: string
  /** 浏览器 */
  browser: string
  /** 登录时间 */
  loginTime: string
  /** 最后活跃时间 */
  lastActiveTime: string
  /** IP地址 */
  ipAddress: string
  /** 是否为当前设备 */
  isCurrent: boolean
}

/**
 * 登录历史记录接口 - 新增
 */
export interface LoginHistory {
  /** 记录ID */
  historyId: string
  /** 登录时间 */
  loginTime: string
  /** 设备名称 */
  deviceName: string
  /** IP地址 */
  ipAddress: string
  /** 登录状态 */
  status: 'success' | 'failed'
  /** 登录地点 */
  location: string
}

/**
 * 用户偏好设置接口 - 新增
 */
export interface UserPreferences {
  /** 邮件通知开关 */
  emailNotification: boolean
  /** 系统通知开关 */
  systemNotification: boolean
  /** 界面主题 */
  theme: 'light' | 'dark' | 'auto'
  /** 语言 */
  language: 'zh-CN' | 'en-US'
}

/**
 * 成就徽章接口 - 新增
 */
export interface Achievement {
  /** 成就ID */
  achievementId: string
  /** 成就名称 */
  name: string
  /** 成就描述 */
  description: string
  /** 成就图标 */
  icon: string
  /** 成就等级 */
  level: number
  /** 是否已获得 */
  unlocked: boolean
  /** 获得时间 */
  unlockedAt?: string
  /** 进度 */
  progress: number
  /** 目标进度 */
  targetProgress: number
}

/**
 * 头像上传结果接口 - 新增
 */
export interface AvatarUploadResult {
  /** 头像URL */
  avatarUrl: string
}

/**
 * 数据导出结果接口 - 新增
 */
export interface DataExportResult {
  /** 导出文件URL */
  downloadUrl: string
  /** 过期时间 */
  expiresAt: string
}
