import request, { uploadRequest } from './index'
import type { ApiResponse } from '@/types/api'
import type { DetectionRecord, MineralCategory, MineralInfo } from '@/types/mineral'

export function detectMineralApi(file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData()
  formData.append('image', file)
  return uploadRequest('/mineral/detect', formData, onProgress) as Promise<ApiResponse<DetectionRecord>>
}

export function getDetectionDetailApi(id: string) {
  return request.get<any, ApiResponse<DetectionRecord>>(`/mineral/detect/${id}`)
}

export function getMineralCategoriesApi() {
  return request.get<any, ApiResponse<MineralCategory[]>>('/mineral/categories')
}

export function getMineralInfoApi(name: string) {
  return request.get<any, ApiResponse<MineralInfo>>(`/mineral/info/${name}`)
}
