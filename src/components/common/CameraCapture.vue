<template>
  <div class="camera-capture">
    <!-- 浏览器不支持摄像头时的提示 -->
    <div v-if="!isSupported" class="camera-unsupported">
      <el-icon :size="48" color="#c0c4cc"><WarningFilled /></el-icon>
      <p>您的浏览器不支持摄像头功能，请使用图片上传方式</p>
    </div>
    <template v-else>
      <!-- 摄像头预览界面 -->
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
      <!-- 拍摄完成预览界面 -->
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

/**
 * 组件属性
 */
defineProps<{
  detecting: boolean // 识别中状态
}>()

/**
 * 组件事件
 */
defineEmits(['detect']) // 开始识别事件

// 矿物识别状态管理
const mineralStore = useMineralStore()

// 视频元素引用
const videoRef = ref<HTMLVideoElement>()
// 浏览器是否支持摄像头
const isSupported = ref(!!navigator.mediaDevices?.getUserMedia)
// 摄像头是否激活
const isActive = ref(false)
// 拍摄的图片 URL
const capturedUrl = ref<string | null>(null)
// 媒体流对象
let stream: MediaStream | null = null

/**
 * 启动摄像头
 * @description 调用浏览器 API 获取摄像头权限并启动预览
 */
async function startCamera() {
  try {
    // 请求摄像头权限，优先使用后置摄像头
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
    })
    // 设置视频源
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
    // 更新摄像头状态
    isActive.value = true
  } catch {
    // 权限被拒绝或设备不可用
    isSupported.value = false
  }
}

/**
 * 拍摄照片
 * @description 从视频流中捕获一帧作为图片
 */
function capture() {
  if (!videoRef.value) return
  
  // 创建画布并绘制视频帧
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(videoRef.value, 0, 0)

  // 将画布转换为图片文件
  canvas.toBlob(
    (blob) => {
      if (!blob) return
      // 创建文件对象并保存到状态管理
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
      mineralStore.setImage(file)
      // 创建图片 URL 用于预览
      capturedUrl.value = URL.createObjectURL(blob)
      // 停止摄像头
      stopCamera()
    },
    'image/jpeg',
    0.9 // 图片质量
  )
}

/**
 * 重新拍摄
 * @description 清除当前图片并重新启动摄像头
 */
function retake() {
  // 释放之前的图片 URL
  if (capturedUrl.value) {
    URL.revokeObjectURL(capturedUrl.value)
    capturedUrl.value = null
  }
  // 清除识别结果
  mineralStore.clearResult()
  // 重新启动摄像头
  startCamera()
}

/**
 * 停止摄像头
 * @description 关闭媒体流并更新状态
 */
function stopCamera() {
  if (stream) {
    // 停止所有媒体轨道
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
  isActive.value = false
}

/**
 * 组件卸载前清理
 * @description 停止摄像头并释放资源
 */
onBeforeUnmount(() => {
  stopCamera()
  // 释放图片 URL
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
