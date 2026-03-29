<template>
  <div class="page-container">
    <h2 class="page-title">系统概览</h2>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6" v-for="card in statsCards" :key="card.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon" :style="{ background: card.color }">
            <el-icon :size="24" color="#fff"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ card.value }}</span>
            <span class="stat-label">{{ card.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header><span>矿物识别频率统计</span></template>
          <StatChart :option="barChartOption" :height="320" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>矿物类型分布</span></template>
          <StatChart :option="pieChartOption" :height="320" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-card shadow="hover" style="margin-top: 20px;">
      <template #header><span>最近活动</span></template>
      <el-table :data="recentDetections" stripe style="width: 100%" max-height="300">
        <el-table-column prop="createdAt" label="时间" width="180">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="识别矿物" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="r in row.results" :key="r.label" size="small" style="margin-right: 4px;">
              {{ r.label }} ({{ (r.confidence * 100).toFixed(0) }}%)
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button text size="small" type="primary" @click="router.push(`/detect/${row.detectId}`)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { formatDate } from '@/utils/format'
import StatChart from '@/components/common/StatChart.vue'
import type { EChartsOption } from 'echarts'

/**
 * 首页视图组件
 * 展示系统概览、统计数据和最近活动
 */

// 路由和状态管理
const router = useRouter()
const historyStore = useHistoryStore()

/**
 * 组件挂载后获取数据
 * 1. 系统统计数据
 * 2. 矿物识别频率
 * 3. 最近检测历史
 */
onMounted(async () => {
  await Promise.all([
    historyStore.fetchStats(),
    historyStore.fetchMineralFrequency(),
    historyStore.fetchDetectionHistory({ page: 1, pageSize: 5 }),
  ])
})

/**
 * 统计卡片数据
 * 基于历史store中的统计数据生成
 */
const statsCards = computed(() => [
  { label: '总识别次数', value: historyStore.stats?.totalDetections || 0, icon: 'Camera', color: '#409eff' },
  { label: '总问答次数', value: historyStore.stats?.totalChats || 0, icon: 'ChatDotRound', color: '#67c23a' },
  { label: '最常识别矿物', value: historyStore.stats?.topMineral || '-', icon: 'Aim', color: '#e6a23c' },
  { label: '本周活跃天数', value: historyStore.stats?.weeklyActiveDays || 0, icon: 'Calendar', color: '#f56c6c' },
])

/**
 * 最近检测记录
 * 取前5条记录
 */
const recentDetections = computed(() => historyStore.detectionRecords.slice(0, 5))

/**
 * 矿物识别频率柱状图配置
 */
const barChartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: historyStore.mineralFrequency.map((m) => m.mineralName),
    axisLabel: { rotate: 30 },
  },
  yAxis: { type: 'value', name: '识别次数' },
  series: [
    {
      type: 'bar',
      data: historyStore.mineralFrequency.map((m) => m.count),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#a0cfff' },
          ],
        } as any,
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
  grid: { left: 60, right: 20, bottom: 60, top: 30 },
}))

/**
 * 矿物类型分布饼图配置
 */
const pieChartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, type: 'scroll' },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: true,
      label: { show: false },
      data: historyStore.mineralFrequency.map((m) => ({ name: m.mineralName, value: m.count })),
    },
  ],
}))
</script>

<style scoped lang="scss">
.page-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #303133;
}
.stats-row {
  .el-col { margin-bottom: 12px; }
}
.stat-card {
  :deep(.el-card__body) {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 2px;
}
</style>
