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

// ============================================
// 以下为新增接口 - 使用 Mock 数据
// ============================================

/**
 * 获取用户统计数据 - 新增接口
 * @returns 返回用户统计数据
 */
export function getUserStatsApi(): Promise<ApiResponse<UserStats>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: {
          totalDetections: 156,
          totalChats: 89,
          activeDays: 42,
          consecutiveDays: 7,
          topMineral: '石英',
          mineralTypes: 23,
          weeklyActivity: [5, 8, 3, 12, 6, 9, 4],
          monthlyActivity: [45, 62, 38, 71],
        },
      })
    }, 500)
  })
}

/**
 * 上传头像 - 新增接口
 * @param file - 头像文件
 * @returns 返回头像 URL
 */
export function uploadAvatarApi(file: File): Promise<ApiResponse<AvatarUploadResult>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const url = URL.createObjectURL(file)
      resolve({
        code: 200,
        message: 'success',
        data: {
          avatarUrl: url,
        },
      })
    }, 800)
  })
}

/**
 * 获取登录设备列表 - 新增接口
 * @returns 返回登录设备列表
 */
export function getLoginDevicesApi(): Promise<ApiResponse<LoginDevice[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: [
          {
            deviceId: 'device-1',
            deviceName: 'Windows PC',
            deviceType: 'desktop',
            os: 'Windows 11',
            browser: 'Chrome 120',
            loginTime: '2024-01-15 09:30:00',
            lastActiveTime: '2024-01-15 14:25:00',
            ipAddress: '192.168.1.100',
            isCurrent: true,
          },
          {
            deviceId: 'device-2',
            deviceName: 'iPhone 15 Pro',
            deviceType: 'mobile',
            os: 'iOS 17.2',
            browser: 'Safari 17',
            loginTime: '2024-01-14 18:45:00',
            lastActiveTime: '2024-01-14 20:30:00',
            ipAddress: '10.0.0.55',
            isCurrent: false,
          },
          {
            deviceId: 'device-3',
            deviceName: 'MacBook Pro',
            deviceType: 'desktop',
            os: 'macOS Sonoma',
            browser: 'Firefox 121',
            loginTime: '2024-01-10 11:00:00',
            lastActiveTime: '2024-01-12 16:45:00',
            ipAddress: '192.168.1.102',
            isCurrent: false,
          },
        ],
      })
    }, 400)
  })
}

/**
 * 强制设备下线 - 新增接口
 * @param deviceId - 设备ID
 * @returns 返回操作结果
 */
export function logoutDeviceApi(deviceId: string): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Logout device:', deviceId)
      resolve({
        code: 200,
        message: 'success',
        data: null,
      })
    }, 300)
  })
}

/**
 * 获取登录历史 - 新增接口
 * @param params - 分页参数
 * @returns 返回登录历史列表
 */
export function getLoginHistoryApi(params: {
  page: number
  pageSize: number
}): Promise<ApiResponse<{ list: LoginHistory[]; total: number }>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: LoginHistory[] = [
        {
          historyId: 'h-1',
          loginTime: '2024-01-15 09:30:00',
          deviceName: 'Windows PC',
          ipAddress: '192.168.1.100',
          status: 'success',
          location: '北京市海淀区',
        },
        {
          historyId: 'h-2',
          loginTime: '2024-01-14 18:45:00',
          deviceName: 'iPhone 15 Pro',
          ipAddress: '10.0.0.55',
          status: 'success',
          location: '北京市朝阳区',
        },
        {
          historyId: 'h-3',
          loginTime: '2024-01-14 08:15:00',
          deviceName: 'Windows PC',
          ipAddress: '192.168.1.100',
          status: 'success',
          location: '北京市海淀区',
        },
        {
          historyId: 'h-4',
          loginTime: '2024-01-13 22:30:00',
          deviceName: 'Unknown Device',
          ipAddress: '103.45.67.89',
          status: 'failed',
          location: '上海市浦东新区',
        },
        {
          historyId: 'h-5',
          loginTime: '2024-01-13 09:00:00',
          deviceName: 'Windows PC',
          ipAddress: '192.168.1.100',
          status: 'success',
          location: '北京市海淀区',
        },
      ]
      resolve({
        code: 200,
        message: 'success',
        data: {
          list: mockData.slice((params.page - 1) * params.pageSize, params.page * params.pageSize),
          total: mockData.length,
        },
      })
    }, 400)
  })
}

/**
 * 获取用户偏好设置 - 新增接口
 * @returns 返回用户偏好设置
 */
export function getUserPreferencesApi(): Promise<ApiResponse<UserPreferences>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: {
          emailNotification: true,
          systemNotification: true,
          theme: 'light',
          language: 'zh-CN',
        },
      })
    }, 300)
  })
}

/**
 * 更新用户偏好设置 - 新增接口
 * @param data - 偏好设置参数
 * @returns 返回更新结果
 */
export function updateUserPreferencesApi(data: Partial<UserPreferences>): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Update preferences:', data)
      resolve({
        code: 200,
        message: 'success',
        data: null,
      })
    }, 300)
  })
}

/**
 * 获取用户成就列表 - 新增接口
 * @returns 返回成就列表
 */
export function getUserAchievementsApi(): Promise<ApiResponse<Achievement[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: [
          {
            achievementId: 'a-1',
            name: '初识矿物',
            description: '完成第一次矿物识别',
            icon: '🎯',
            level: 1,
            unlocked: true,
            unlockedAt: '2024-01-01 10:30:00',
            progress: 1,
            targetProgress: 1,
          },
          {
            achievementId: 'a-2',
            name: '识别达人',
            description: '累计识别100次矿物',
            icon: '🏆',
            level: 2,
            unlocked: true,
            unlockedAt: '2024-01-10 15:20:00',
            progress: 156,
            targetProgress: 100,
          },
          {
            achievementId: 'a-3',
            name: '探索者',
            description: '识别10种不同的矿物',
            icon: '🔬',
            level: 1,
            unlocked: true,
            unlockedAt: '2024-01-05 14:00:00',
            progress: 23,
            targetProgress: 10,
          },
          {
            achievementId: 'a-4',
            name: '矿物大师',
            description: '识别50种不同的矿物',
            icon: '💎',
            level: 3,
            unlocked: false,
            progress: 23,
            targetProgress: 50,
          },
          {
            achievementId: 'a-5',
            name: '问答新星',
            description: '完成50次科普问答',
            icon: '💬',
            level: 1,
            unlocked: true,
            unlockedAt: '2024-01-08 11:45:00',
            progress: 89,
            targetProgress: 50,
          },
          {
            achievementId: 'a-6',
            name: '活跃用户',
            description: '连续登录7天',
            icon: '🔥',
            level: 1,
            unlocked: true,
            unlockedAt: '2024-01-15 09:00:00',
            progress: 7,
            targetProgress: 7,
          },
          {
            achievementId: 'a-7',
            name: '坚持不懈',
            description: '连续登录30天',
            icon: '⭐',
            level: 2,
            unlocked: false,
            progress: 7,
            targetProgress: 30,
          },
          {
            achievementId: 'a-8',
            name: '矿物百科',
            description: '完成200次科普问答',
            icon: '📚',
            level: 2,
            unlocked: false,
            progress: 89,
            targetProgress: 200,
          },
        ],
      })
    }, 500)
  })
}

/**
 * 导出用户数据 - 新增接口
 * @returns 返回导出文件信息
 */
export function exportUserDataApi(): Promise<ApiResponse<DataExportResult>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: 'success',
        data: {
          downloadUrl: '/api/user/data/export/download?token=xxx',
          expiresAt: '2024-01-16 09:30:00',
        },
      })
    }, 1000)
  })
}

/**
 * 清除历史记录 - 新增接口
 * @param type - 清除类型
 * @returns 返回操作结果
 */
export function clearHistoryApi(type: 'detect' | 'chat' | 'all'): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Clear history:', type)
      resolve({
        code: 200,
        message: 'success',
        data: null,
      })
    }, 500)
  })
}

/**
 * 注销账户 - 新增接口
 * @param password - 用户密码确认
 * @returns 返回操作结果
 */
export function deleteAccountApi(password: string): Promise<ApiResponse<null>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (password === '123456') {
        resolve({
          code: 200,
          message: 'success',
          data: null,
        })
      } else {
        reject(new Error('密码错误'))
      }
    }, 500)
  })
}
