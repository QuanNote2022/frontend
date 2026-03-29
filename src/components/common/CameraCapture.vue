<template>
  <div class="camera-capture">
    <div v-if="!isSupported" class="camera-unsupported">
      <el-icon :size="48" color="#c0c4cc"><WarningFilled /></el-icon>
      <p>您的浏览器不支持摄像头功能，请使用图片上传方式</p>
    </div>
    <template v-else>
      <div v-if="!capturedUrl" class="camera-preview">
        <video ref="videoRef" autoplay playsinline muted class="camera-video" />
        <div class="camera-controls">
          <el-button v-if="!isActive" type="primary" @click="startCamera">
            <el-icon><VideoCamera /></el-icon>打开摄像头
          </el-button>
          <el-button v-else type="primary" circle :size="'large'" @click="capture">
            <el-icon :size="24"><Camera /></el-icon>
          </el-button>
        </div>
      </div>
      <div v-else class="captured-preview">
        <img :src="capturedUrl" alt="拍摄照片" />
        <div class="camera-controls">
          <el-button @click="retake">重新拍摄</el-button>
          <el-button type="primary" :loading="detecting" @click="$emit('detect')">
            <el-icon><Search /></el-icon>开始识别
          </el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useMineralStore } from '@/stores/mineral'

defineProps<{ detecting: boolean }>()
defineEmits(['detect'])

const mineralStore = useMineralStore()

const videoRef = ref<HTMLVideoElement>()
const isSupported = ref(!!navigator.mediaDevices?.getUserMedia)
const isActive = ref(false)
const capturedUrl = ref<string | null>(null)
let stream: MediaStream | null = null

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
    isActive.value = true
  } catch {
    isSupported.value = false
  }
}

function capture() {
  if (!videoRef.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(videoRef.value, 0, 0)

  canvas.toBlob(
    (blob) => {
      if (!blob) return
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
      mineralStore.setImage(file)
      capturedUrl.value = URL.createObjectURL(blob)
      stopCamera()
    },
    'image/jpeg',
    0.9
  )
}

function retake() {
  if (capturedUrl.value) {
    URL.revokeObjectURL(capturedUrl.value)
    capturedUrl.value = null
  }
  mineralStore.clearResult()
  startCamera()
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
  isActive.value = false
}

onBeforeUnmount(() => {
  stopCamera()
  if (capturedUrl.value) {
    URL.revokeObjectURL(capturedUrl.value)
  }
})
</script>

<style scoped lang="scss">
.camera-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.camera-unsupported {
  text-align: center;
  padding: 40px;
  p { color: #909399; margin-top: 12px; }
}
.camera-preview, .captured-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.camera-video {
  width: 100%;
  max-height: 360px;
  border-radius: 8px;
  background: #000;
  object-fit: contain;
}
.captured-preview img {
  max-width: 100%;
  max-height: 360px;
  border-radius: 8px;
  object-fit: contain;
}
.camera-controls {
  display: flex;
  gap: 12px;
}
</style>
