import request from './index'
import type { ApiResponse, PageResult, PageQuery } from '@/types/api'
import type { DetectionRecord } from '@/types/mineral'
import type { ChatSession } from '@/types/chat'

export interface StatsOverview {
  totalDetections: number
  totalChats: number
  topMineral: string
  weeklyActiveDays: number
}

export interface MineralFrequency {
  mineralName: string
  count: number
}

export interface DetectionHistoryQuery extends PageQuery {
  keyword?: string
  startDate?: string
  endDate?: string
}

export function getDetectionHistoryApi(params?: DetectionHistoryQuery) {
  return request.get<any, ApiResponse<PageResult<DetectionRecord>>>('/history/detections', { params })
}

export function deleteDetectionRecordApi(id: string) {
  return request.delete<any, ApiResponse<null>>(`/history/detections/${id}`)
}

export function getChatHistoryApi(params?: PageQuery) {
  return request.get<any, ApiResponse<PageResult<ChatSession>>>('/history/chats', { params })
}

export function getStatsOverviewApi() {
  return request.get<any, ApiResponse<StatsOverview>>('/stats/overview')
}

export function getMineralFrequencyApi(days = 30) {
  return request.get<any, ApiResponse<MineralFrequency[]>>('/stats/mineral-frequency', { params: { days } })
}
