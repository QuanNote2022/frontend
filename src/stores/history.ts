/**
 * 历史记录状态管理
 * 管理检测历史、聊天历史和统计数据
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getDetectionHistoryApi,
  getChatHistoryApi,
  deleteDetectionRecordApi,
  getStatsOverviewApi,
  getMineralFrequencyApi,
} from '@/api/history'
import type { StatsOverview, MineralFrequency, DetectionHistoryQuery } from '@/api/history'
import type { DetectionRecord } from '@/types/mineral'
import type { ChatSession } from '@/types/chat'

/**
 * 历史记录状态存储
 */
export const useHistoryStore = defineStore('history', () => {
  // 状态
  const detectionRecords = ref<DetectionRecord[]>([]) // 检测记录
  const chatRecords = ref<ChatSession[]>([]) // 聊天记录
  const stats = ref<StatsOverview | null>(null) // 统计数据
  const mineralFrequency = ref<MineralFrequency[]>([]) // 矿物识别频率
  const total = ref(0) // 总记录数
  const loading = ref(false) // 加载状态

  /**
   * 获取检测历史
   * @param params 查询参数
   */
  async function fetchDetectionHistory(params?: DetectionHistoryQuery) {
    loading.value = true
    try {
      const res = await getDetectionHistoryApi(params)
      detectionRecords.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取聊天历史
   * @param page 页码
   * @param pageSize 每页大小
   */
  async function fetchChatHistory(page = 1, pageSize = 20) {
    loading.value = true
    try {
      const res = await getChatHistoryApi({ page, pageSize })
      chatRecords.value = res.data.list
      total.value = res.data.total
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除检测记录
   * @param id 记录ID
   */
  async function removeDetectionRecord(id: string) {
    await deleteDetectionRecordApi(id)
    detectionRecords.value = detectionRecords.value.filter((r) => r.detectId !== id)
  }

  /**
   * 获取统计数据
   */
  async function fetchStats() {
    const res = await getStatsOverviewApi()
    stats.value = res.data
  }

  /**
   * 获取矿物识别频率
   * @param days 天数
   */
  async function fetchMineralFrequency(days = 30) {
    const res = await getMineralFrequencyApi(days)
    mineralFrequency.value = res.data
  }

  return {
    detectionRecords, chatRecords, stats, mineralFrequency, total, loading,
    fetchDetectionHistory, fetchChatHistory, removeDetectionRecord, fetchStats, fetchMineralFrequency,
  }
})
