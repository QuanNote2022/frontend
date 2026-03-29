/**
 * 矿物识别相关 API 接口
 * 提供矿物识别、获取识别详情、矿物分类和矿物信息等操作
 */
import request, { uploadRequest } from './index'
import type { ApiResponse } from '@/types/api'
import type { DetectionRecord, MineralCategory, MineralInfo } from '@/types/mineral'

/**
 * 矿物识别
 * @param file - 要识别的图片文件
 * @param onProgress - 上传进度回调函数
 * @returns 返回识别结果
 */
export function detectMineralApi(file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData()
  formData.append('image', file) // 添加图片文件到表单数据
  return uploadRequest('/mineral/detect', formData, onProgress) as Promise<ApiResponse<DetectionRecord>>
}

/**
 * 获取矿物识别详情
 * @param id - 识别记录 ID
 * @returns 返回识别详情
 */
export function getDetectionDetailApi(id: string) {
  return request.get<any, ApiResponse<DetectionRecord>>(`/mineral/detect/${id}`)
}

/**
 * 获取矿物分类列表
 * @returns 返回矿物分类列表
 */
export function getMineralCategoriesApi() {
  return request.get<any, ApiResponse<MineralCategory[]>>('/mineral/categories')
}

/**
 * 获取矿物详细信息
 * @param name - 矿物名称
 * @returns 返回矿物详细信息
 */
export function getMineralInfoApi(name: string) {
  return request.get<any, ApiResponse<MineralInfo>>(`/mineral/info/${name}`)
}
