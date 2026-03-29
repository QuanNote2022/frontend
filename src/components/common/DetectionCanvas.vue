<template>
  <div class="detection-canvas" ref="containerRef">
    <!-- 原始图像 -->
    <img ref="imgRef" :src="imageUrl" @load="onImageLoad" class="detection-img" />
    <!-- 用于绘制检测结果的画布 -->
    <canvas ref="canvasRef" class="detection-overlay" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { DetectionResult } from '@/types/mineral'

/**
 * 检测结果画布组件
 * 用于在图像上绘制矿物检测结果，包括边界框和标签
 */

/**
 * 组件属性
 */
const props = defineProps<{
  /** 图像URL */
  imageUrl: string
  /** 检测结果数组 */
  results: DetectionResult[]
}>()

// 引用
const containerRef = ref<HTMLDivElement>()
const imgRef = ref<HTMLImageElement>()
const canvasRef = ref<HTMLCanvasElement>()

// 边界框颜色数组
const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#b37feb', '#36cfc9', '#ff85c0']

// 尺寸观察器
let observer: ResizeObserver | null = null

/**
 * 绘制检测结果
 * 在画布上绘制边界框和标签
 */
function drawDetections() {
  const img = imgRef.value
  const canvas = canvasRef.value
  if (!img || !canvas) return

  // 获取图像显示尺寸和原始尺寸
  const displayW = img.clientWidth
  const displayH = img.clientHeight
  const naturalW = img.naturalWidth || displayW
  const naturalH = img.naturalHeight || displayH

  // 设置画布尺寸
  canvas.width = displayW
  canvas.height = displayH
  canvas.style.width = `${displayW}px`
  canvas.style.height = `${displayH}px`

  // 获取画布上下文并清空
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, displayW, displayH)

  // 计算缩放比例
  const scaleX = displayW / naturalW
  const scaleY = displayH / naturalH

  // 绘制每个检测结果
  props.results.forEach((r, i) => {
    const [x, y, w, h] = r.bbox
    const dx = x * scaleX
    const dy = y * scaleY
    const dw = w * scaleX
    const dh = h * scaleY
    const color = colors[i % colors.length]

    // 绘制边界框
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.strokeRect(dx, dy, dw, dh)

    // 绘制标签
    const label = `${r.label} ${(r.confidence * 100).toFixed(0)}%`
    ctx.font = '14px sans-serif'
    const textW = ctx.measureText(label).width + 8
    ctx.fillStyle = color
    ctx.fillRect(dx, dy - 22, textW, 22)
    ctx.fillStyle = '#fff'
    ctx.fillText(label, dx + 4, dy - 6)
  })
}

/**
 * 图像加载完成回调
 * 当图像加载完成后绘制检测结果
 */
function onImageLoad() {
  drawDetections()
}

// 监听检测结果变化
watch(() => props.results, drawDetections, { deep: true })

// 组件挂载后设置尺寸观察器
onMounted(() => {
  if (containerRef.value) {
    observer = new ResizeObserver(() => drawDetections())
    observer.observe(containerRef.value)
  }
})

// 组件卸载前清理观察器
onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<style scoped lang="scss">
.detection-canvas {
  position: relative;
  display: inline-block;
  width: 100%;
}
.detection-img {
  max-width: 100%;
  max-height: 400px;
  display: block;
  border-radius: 8px;
  object-fit: contain;
}
.detection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
</style>
