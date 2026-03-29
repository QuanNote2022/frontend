/**
 * 历史记录相关 API 接口
 * 提供检测历史、聊天历史、统计概览等操作
 */
import request from './index'
import type { ApiResponse, PageResult, PageQuery } from '@/types/api'
import type { DetectionRecord } from '@/types/mineral'
import type { ChatSession } from '@/types/chat'

/**
 * 统计概览接口
 */
export interface StatsOverview {
  totalDetections: number // 总检测次数
  totalChats: number // 总聊天次数
  topMineral: string // 最常检测的矿物
  weeklyActiveDays: number // 每周活跃天数
}

/**
 * 矿物频率接口
 */
export interface MineralFrequency {
  mineralName: string // 矿物名称
  count: number // 检测次数
}

/**
 * 检测历史查询参数接口
 */
export interface DetectionHistoryQuery extends PageQuery {
  keyword?: string // 关键词
  startDate?: string // 开始日期
  endDate?: string // 结束日期
}

/**
 * 获取检测历史
 * @param params - 查询参数
 * @returns 返回检测历史列表
 */
export function getDetectionHistoryApi(params?: DetectionHistoryQuery) {
  return request.get<any, ApiResponse<PageResult<DetectionRecord>>>('/history/detections', { params })
}

/**
 * 删除检测记录
 * @param id - 记录 ID
 * @returns 返回删除结果
 */
export function deleteDetectionRecordApi(id: string) {
  return request.delete<any, ApiResponse<null>>(`/history/detections/${id}`)
}

/**
 * 获取聊天历史
 * @param params - 分页参数
 * @returns 返回聊天历史列表
 */
export function getChatHistoryApi(params?: PageQuery) {
  return request.get<any, ApiResponse<PageResult<ChatSession>>>('/history/chats', { params })
}

/**
 * 获取统计概览
 * @returns 返回统计概览数据
 */
export function getStatsOverviewApi() {
  return request.get<any, ApiResponse<StatsOverview>>('/stats/overview')
}

/**
 * 获取矿物频率
 * @param days - 统计天数，默认 30 天
 * @returns 返回矿物频率列表
 */
export function getMineralFrequencyApi(days = 30) {
  return request.get<any, ApiResponse<MineralFrequency[]>>('/stats/mineral-frequency', { params: { days } })
}
