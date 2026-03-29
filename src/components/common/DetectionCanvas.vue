<template>
  <div class="detection-canvas" ref="containerRef">
    <img ref="imgRef" :src="imageUrl" @load="onImageLoad" class="detection-img" />
    <canvas ref="canvasRef" class="detection-overlay" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { DetectionResult } from '@/types/mineral'

const props = defineProps<{
  imageUrl: string
  results: DetectionResult[]
}>()

const containerRef = ref<HTMLDivElement>()
const imgRef = ref<HTMLImageElement>()
const canvasRef = ref<HTMLCanvasElement>()

const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#b37feb', '#36cfc9', '#ff85c0']

let observer: ResizeObserver | null = null

function drawDetections() {
  const img = imgRef.value
  const canvas = canvasRef.value
  if (!img || !canvas) return

  const displayW = img.clientWidth
  const displayH = img.clientHeight
  const naturalW = img.naturalWidth || displayW
  const naturalH = img.naturalHeight || displayH

  canvas.width = displayW
  canvas.height = displayH
  canvas.style.width = `${displayW}px`
  canvas.style.height = `${displayH}px`

  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, displayW, displayH)

  const scaleX = displayW / naturalW
  const scaleY = displayH / naturalH

  props.results.forEach((r, i) => {
    const [x, y, w, h] = r.bbox
    const dx = x * scaleX
    const dy = y * scaleY
    const dw = w * scaleX
    const dh = h * scaleY
    const color = colors[i % colors.length]

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.strokeRect(dx, dy, dw, dh)

    const label = `${r.label} ${(r.confidence * 100).toFixed(0)}%`
    ctx.font = '14px sans-serif'
    const textW = ctx.measureText(label).width + 8
    ctx.fillStyle = color
    ctx.fillRect(dx, dy - 22, textW, 22)
    ctx.fillStyle = '#fff'
    ctx.fillText(label, dx + 4, dy - 6)
  })
}

function onImageLoad() {
  drawDetections()
}

watch(() => props.results, drawDetections, { deep: true })

onMounted(() => {
  if (containerRef.value) {
    observer = new ResizeObserver(() => drawDetections())
    observer.observe(containerRef.value)
  }
})

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
