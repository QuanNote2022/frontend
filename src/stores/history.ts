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

export const useHistoryStore = defineStore('history', () => {
  const detectionRecords = ref<DetectionRecord[]>([])
  const chatRecords = ref<ChatSession[]>([])
  const stats = ref<StatsOverview | null>(null)
  const mineralFrequency = ref<MineralFrequency[]>([])
  const total = ref(0)
  const loading = ref(false)

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

  async function removeDetectionRecord(id: string) {
    await deleteDetectionRecordApi(id)
    detectionRecords.value = detectionRecords.value.filter((r) => r.detectId !== id)
  }

  async function fetchStats() {
    const res = await getStatsOverviewApi()
    stats.value = res.data
  }

  async function fetchMineralFrequency(days = 30) {
    const res = await getMineralFrequencyApi(days)
    mineralFrequency.value = res.data
  }

  return {
    detectionRecords, chatRecords, stats, mineralFrequency, total, loading,
    fetchDetectionHistory, fetchChatHistory, removeDetectionRecord, fetchStats, fetchMineralFrequency,
  }
})
