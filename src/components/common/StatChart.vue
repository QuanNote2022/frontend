<template>
  <!-- 图表容器 -->
  <div ref="chartRef" class="stat-chart" :style="{ height: height + 'px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  option: EChartsOption
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300
})

// 图表容器引用
const chartRef = ref<HTMLDivElement>()
// ECharts 实例
let chart: echarts.ECharts | null = null

/**
 * 初始化图表
 * @description 创建 ECharts 实例并设置配置选项
 */
function initChart() {
  if (!chartRef.value) return
  // 创建 ECharts 实例
  chart = echarts.init(chartRef.value)
  // 设置图表配置
  chart.setOption(props.option)
}

/**
 * 监听配置选项变化
 * @description 当配置选项变化时，更新图表
 */
watch(
  () => props.option,
  (newOpt) => {
    if (chart) {
      // 重新设置配置，true 表示不合并配置
      chart.setOption(newOpt, true)
    }
  },
  { deep: true } // 深度监听对象变化
)

/**
 * 处理窗口 resize 事件
 * @description 调整图表大小以适应容器
 */
function handleResize() {
  chart?.resize()
}

/**
 * 组件挂载后初始化图表
 * @description 创建图表实例并添加窗口 resize 事件监听
 */
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

/**
 * 组件卸载前清理
 * @description 移除事件监听器并销毁图表实例
 */
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose() // 销毁图表实例，释放资源
})
</script>

<style scoped>
.stat-chart {
  width: 100%;
}
</style>
