/**
 * 矿物识别状态管理
 * 管理矿物识别相关的状态和操作
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { detectMineralApi, getDetectionDetailApi } from '@/api/mineral'
import type { DetectionRecord, DetectionResult } from '@/types/mineral'

/**
 * 矿物识别状态存储
 */
export const useMineralStore = defineStore('mineral', () => {
  // 状态
  const currentImage = ref<File | null>(null) // 当前选中的图像文件
  const imagePreviewUrl = ref<string | null>(null) // 图像预览URL
  const detectionResult = ref<DetectionRecord | null>(null) // 检测结果
  const isDetecting = ref(false) // 检测状态

  /**
   * 设置图像文件
   * @param file 图像文件
   */
  function setImage(file: File) {
    currentImage.value = file
    if (imagePreviewUrl.value) {
      URL.revokeObjectURL(imagePreviewUrl.value)
    }
    imagePreviewUrl.value = URL.createObjectURL(file)
  }

  /**
   * 执行矿物识别
   * @returns 检测结果
   */
  async function detect() {
    if (!currentImage.value) return
    isDetecting.value = true
    try {
      const res = await detectMineralApi(currentImage.value)
      detectionResult.value = res.data
      return res.data
    } finally {
      isDetecting.value = false
    }
  }

  /**
   * 获取检测详情
   * @param id 检测记录ID
   * @returns 检测详情
   */
  async function fetchDetail(id: string) {
    const res = await getDetectionDetailApi(id)
    detectionResult.value = res.data
    return res.data
  }

  /**
   * 清除检测结果
   */
  function clearResult() {
    detectionResult.value = null
    currentImage.value = null
    if (imagePreviewUrl.value) {
      URL.revokeObjectURL(imagePreviewUrl.value)
      imagePreviewUrl.value = null
    }
  }

  return { currentImage, imagePreviewUrl, detectionResult, isDetecting, setImage, detect, fetchDetail, clearResult }
})
