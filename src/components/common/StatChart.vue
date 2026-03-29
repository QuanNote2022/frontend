<template>
  <div ref="chartRef" class="stat-chart" :style="{ height: height + 'px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  option: EChartsOption
  height?: number
}>()

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
}

watch(
  () => props.option,
  (newOpt) => {
    if (chart) {
      chart.setOption(newOpt, true)
    }
  },
  { deep: true }
)

function handleResize() {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped>
.stat-chart {
  width: 100%;
}
</style>
