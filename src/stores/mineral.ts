import { defineStore } from 'pinia'
import { ref } from 'vue'
import { detectMineralApi, getDetectionDetailApi } from '@/api/mineral'
import type { DetectionRecord, DetectionResult } from '@/types/mineral'

export const useMineralStore = defineStore('mineral', () => {
  const currentImage = ref<File | null>(null)
  const imagePreviewUrl = ref<string | null>(null)
  const detectionResult = ref<DetectionRecord | null>(null)
  const isDetecting = ref(false)

  function setImage(file: File) {
    currentImage.value = file
    if (imagePreviewUrl.value) {
      URL.revokeObjectURL(imagePreviewUrl.value)
    }
    imagePreviewUrl.value = URL.createObjectURL(file)
  }

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

  async function fetchDetail(id: string) {
    const res = await getDetectionDetailApi(id)
    detectionResult.value = res.data
    return res.data
  }

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
