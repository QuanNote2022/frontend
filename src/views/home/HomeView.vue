<template>
  <div class="home-container">
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">
          <el-icon><TrendCharts /></el-icon>
          <span>实时数据</span>
        </div>
        <h2 class="page-title">系统概览</h2>
        <p class="page-subtitle">实时监控矿物识别与科普问答数据</p>
      </div>
      <div class="header-decoration">
        <div class="decoration-circle"></div>
        <div class="decoration-circle"></div>
        <div class="decoration-circle"></div>
      </div>
    </div>

    <div class="stats-grid">
      <transition-group name="card-reveal">
        <div
          v-for="(card, index) in statsCards"
          :key="card.label"
          class="stat-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="stat-card-inner" v-if="!historyStore.loading">
            <div class="stat-icon" :style="{ background: card.color }">
              <el-icon :size="24"><component :is="card.icon" /></el-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ card.value }}</span>
              <span class="stat-label">{{ card.label }}</span>
            </div>
            <div class="stat-trend" :class="card.trend > 0 ? 'up' : 'down'">
              <el-icon :size="14">
                <component :is="card.trend > 0 ? 'Top' : 'Bottom'" />
              </el-icon>
              <span>{{ Math.abs(card.trend) }}%</span>
            </div>
          </div>
          <div v-else class="stat-skeleton">
            <el-skeleton :rows="2" animated />
          </div>
        </div>
      </transition-group>
    </div>

    <div class="charts-section">
      <div class="chart-card main-chart">
        <div class="chart-header">
          <div class="chart-title-group">
            <h3 class="chart-title">矿物识别频率统计</h3>
            <el-tag size="small" effect="plain" class="chart-tag">近30天</el-tag>
          </div>
          <div class="chart-actions">
            <el-button-group size="small">
              <el-button :type="chartType === 'bar' ? 'primary' : 'default'" @click="chartType = 'bar'">
                柱状图
              </el-button>
              <el-button :type="chartType === 'line' ? 'primary' : 'default'" @click="chartType = 'line'">
                折线图
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div class="chart-body">
          <div v-if="historyStore.loading" class="chart-skeleton">
            <el-skeleton :rows="8" animated />
          </div>
          <div v-else-if="historyStore.mineralFrequency.length === 0" class="empty-chart">
            <div class="empty-icon">
              <el-icon :size="64"><DataLine /></el-icon>
            </div>
            <p>暂无识别数据</p>
            <el-button type="primary" @click="router.push('/detect')">开始识别</el-button>
          </div>
          <StatChart v-else :option="chartOption" :height="360" />
        </div>
      </div>

      <div class="chart-card side-chart">
        <div class="chart-header">
          <h3 class="chart-title">矿物类型分布</h3>
        </div>
        <div class="chart-body">
          <div v-if="historyStore.loading" class="chart-skeleton">
            <el-skeleton :rows="8" animated />
          </div>
          <div v-else-if="historyStore.mineralFrequency.length === 0" class="empty-chart">
            <div class="empty-icon">
              <el-icon :size="64"><PieChart /></el-icon>
            </div>
            <p>暂无分布数据</p>
          </div>
          <StatChart v-else :option="pieChartOption" :height="360" />
        </div>
      </div>
    </div>

    <div class="activity-section">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><Clock /></el-icon>
          最近活动
        </h3>
        <el-button text type="primary" @click="router.push('/history/detect')">
          查看全部
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      
      <transition name="fade" mode="out-in">
        <div v-if="historyStore.loading" class="table-skeleton">
          <el-skeleton :rows="5" animated />
        </div>
        
        <div v-else-if="recentDetections.length === 0" class="empty-activity">
          <div class="empty-icon">
            <el-icon :size="48"><Document /></el-icon>
          </div>
          <p>暂无活动记录</p>
        </div>
        
        <div v-else class="activity-list">
          <div
            v-for="(item, index) in recentDetections"
            :key="item.detectId"
            class="activity-item"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <div class="activity-icon">
              <el-icon :size="20"><Camera /></el-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">识别了 {{ item.results.length }} 种矿物</div>
              <div class="activity-tags">
                <el-tag
                  v-for="r in item.results.slice(0, 3)"
                  :key="r.label"
                  size="small"
                  class="mineral-tag"
                >
                  {{ r.label }}
                  <span class="confidence">{{ (r.confidence * 100).toFixed(0) }}%</span>
                </el-tag>
                <span v-if="item.results.length > 3" class="more-tag">
                  +{{ item.results.length - 3 }}
                </span>
              </div>
            </div>
            <div class="activity-time">
              <el-icon><Clock /></el-icon>
              {{ formatDate(item.createdAt) }}
            </div>
            <el-button
              text
              size="small"
              type="primary"
              class="activity-action"
              @click="router.push(`/detect/${item.detectId}`)"
            >
              详情
            </el-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { formatDate } from '@/utils/format'
import StatChart from '@/components/common/StatChart.vue'
import type { EChartsOption } from 'echarts'

const router = useRouter()
const historyStore = useHistoryStore()
const chartType = ref<'bar' | 'line'>('bar')

onMounted(async () => {
  await Promise.all([
    historyStore.fetchStats(),
    historyStore.fetchMineralFrequency(),
    historyStore.fetchDetectionHistory({ page: 1, pageSize: 5 }),
  ])
})

const statsCards = computed(() => [
  { 
    label: '总识别次数', 
    value: historyStore.stats?.totalDetections || 0, 
    icon: 'Camera', 
    color: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    trend: 12
  },
  { 
    label: '总问答次数', 
    value: historyStore.stats?.totalChats || 0, 
    icon: 'ChatDotRound', 
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    trend: 8
  },
  { 
    label: '最常识别矿物', 
    value: historyStore.stats?.topMineral || '-', 
    icon: 'Aim', 
    color: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    trend: 0
  },
  { 
    label: '本周活跃天数', 
    value: historyStore.stats?.weeklyActiveDays || 0, 
    icon: 'Calendar', 
    color: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    trend: 5
  },
])

const recentDetections = computed(() => historyStore.detectionRecords.slice(0, 5))

const chartOption = computed<EChartsOption>(() => {
  const baseOption = {
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: { color: '#303133' },
      axisPointer: {
        type: chartType.value === 'line' ? 'cross' : 'shadow'
      }
    },
    grid: { left: 60, right: 20, bottom: 60, top: 40 },
    xAxis: {
      type: 'category',
      data: historyStore.mineralFrequency.map((m) => m.mineralName),
      axisLabel: { rotate: 30, color: '#606266' },
      axisLine: { lineStyle: { color: '#e4e7ed' } },
    },
    yAxis: { 
      type: 'value', 
      name: '识别次数',
      nameTextStyle: { color: '#909399' },
      axisLabel: { color: '#606266' },
      splitLine: { lineStyle: { color: '#f0f2f5' } },
    },
  }
  
  if (chartType.value === 'bar') {
    return {
      ...baseOption,
      series: [{
        type: 'bar',
        data: historyStore.mineralFrequency.map((m) => m.count),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#8b5cf6' },
            ],
          } as any,
          borderRadius: [6, 6, 0, 0],
        },
        barWidth: '50%',
      }],
    }
  }
  
  return {
    ...baseOption,
    series: [{
      type: 'line',
      data: historyStore.mineralFrequency.map((m) => m.count),
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#8b5cf6' },
          ],
        } as any,
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0.05)' },
          ],
        } as any,
      },
      itemStyle: { color: '#3b82f6' },
    }],
  }
})

const pieChartOption = computed<EChartsOption>(() => ({
  tooltip: { 
    trigger: 'item', 
    formatter: '{b}: {c} ({d}%)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e4e7ed',
    borderWidth: 1,
    textStyle: { color: '#303133' },
  },
  legend: { 
    bottom: 0, 
    type: 'scroll',
    textStyle: { color: '#606266' },
  },
  series: [{
    type: 'pie',
    radius: ['45%', '75%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: true,
    itemStyle: {
      borderRadius: 8,
      borderColor: '#fff',
      borderWidth: 2,
    },
    label: { show: false },
    emphasis: {
      label: { show: true, fontSize: 14, fontWeight: 'bold' },
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
      },
    },
    data: historyStore.mineralFrequency.map((m, i) => ({ 
      name: m.mineralName, 
      value: m.count,
      itemStyle: {
        color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][i % 6]
      }
    })),
  }],
}))
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.home-container {
  padding: 0;
  background: $bg-primary;
  min-height: calc(100vh - $header-height - $spacing-10);
}

.page-header {
  position: relative;
  padding: $spacing-10 $spacing-8;
  background: $gradient-primary;
  border-radius: $radius-2xl;
  margin-bottom: $spacing-6;
  overflow: hidden;
  
  .header-content {
    position: relative;
    z-index: 2;
  }
  
  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: $spacing-2;
    padding: $spacing-2 $spacing-4;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border-radius: $radius-full;
    margin-bottom: $spacing-4;
    
    .el-icon { font-size: 14px; }
    span {
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      color: white;
      letter-spacing: $letter-spacing-wide;
    }
  }
  
  .page-title {
    font-size: $font-size-4xl;
    font-weight: $font-weight-extrabold;
    color: white;
    margin: 0 0 $spacing-2;
    letter-spacing: $letter-spacing-tight;
  }
  
  .page-subtitle {
    font-size: $font-size-base;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
  }
  
  .header-decoration {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 50%;
    
    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      
      &:nth-child(1) {
        width: 300px;
        height: 300px;
        top: -100px;
        right: -50px;
      }
      
      &:nth-child(2) {
        width: 200px;
        height: 200px;
        bottom: -50px;
        right: 100px;
      }
      
      &:nth-child(3) {
        width: 100px;
        height: 100px;
        top: 50%;
        right: 200px;
        transform: translateY(-50%);
      }
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-5;
  margin-bottom: $spacing-6;
  
  @media (max-width: $breakpoint-xl) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  overflow: hidden;
  transition: $transition-slow;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: rgba($primary-500, 0.2);
  }
}

.stat-card-inner {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-5;
}

.stat-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-xl;
  color: white;
  flex-shrink: 0;
  box-shadow: $shadow-md;
}

.stat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  line-height: 1.2;
}

.stat-label {
  font-size: $font-size-sm;
  color: $gray-500;
  margin-top: $spacing-1;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: $spacing-1;
  padding: $spacing-1 $spacing-2;
  border-radius: $radius-full;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  
  &.up {
    background: rgba($success-color, 0.1);
    color: $success-color;
  }
  
  &.down {
    background: rgba($danger-color, 0.1);
    color: $danger-color;
  }
}

.stat-skeleton {
  padding: $spacing-5;
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: $spacing-5;
  margin-bottom: $spacing-6;
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  overflow: hidden;
  
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-5 $spacing-6;
    border-bottom: 1px solid $gray-100;
  }
  
  .chart-title-group {
    display: flex;
    align-items: center;
    gap: $spacing-3;
  }
  
  .chart-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-800;
    margin: 0;
  }
  
  .chart-tag {
    background: rgba($primary-500, 0.1);
    color: $primary-600;
    border: none;
  }
  
  .chart-body {
    padding: $spacing-6;
  }
  
  .chart-skeleton {
    padding: $spacing-4 0;
  }
  
  .empty-chart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    
    .empty-icon {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $gray-50;
      border-radius: $radius-2xl;
      margin-bottom: $spacing-4;
      color: $gray-300;
    }
    
    p {
      color: $gray-500;
      margin-bottom: $spacing-4;
    }
  }
}

.activity-section {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  overflow: hidden;
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-5 $spacing-6;
    border-bottom: 1px solid $gray-100;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-800;
    margin: 0;
    
    .el-icon { color: $primary-500; }
  }
}

.activity-list {
  padding: $spacing-4;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-4;
  border-radius: $radius-lg;
  transition: $transition-fast;
  animation: slideIn 0.3s ease-out forwards;
  opacity: 0;
  transform: translateX(-10px);
  
  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &:hover {
    background: $gray-50;
  }
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($primary-500, 0.1);
  border-radius: $radius-lg;
  color: $primary-500;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-800;
  margin-bottom: $spacing-2;
}

.activity-tags {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  flex-wrap: wrap;
}

.mineral-tag {
  background: $gradient-primary;
  border: none;
  color: white;
  font-weight: $font-weight-medium;
  
  .confidence {
    margin-left: $spacing-1;
    opacity: 0.85;
    font-size: $font-size-xs;
  }
}

.more-tag {
  font-size: $font-size-xs;
  color: $gray-500;
  padding: $spacing-1 $spacing-2;
  background: $gray-100;
  border-radius: $radius-sm;
}

.activity-time {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $font-size-xs;
  color: $gray-500;
  
  .el-icon { font-size: 14px; }
}

.activity-action {
  opacity: 0;
  transition: $transition-fast;
}

.activity-item:hover .activity-action {
  opacity: 1;
}

.empty-activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-12;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gray-50;
    border-radius: $radius-2xl;
    margin-bottom: $spacing-4;
    color: $gray-300;
  }
  
  p {
    color: $gray-500;
  }
}

.card-reveal-enter-active {
  transition: all 0.5s $ease-out;
}

.card-reveal-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: $breakpoint-md) {
  .page-header {
    padding: $spacing-6 $spacing-4;
    
    .page-title {
      font-size: $font-size-2xl;
    }
    
    .header-decoration {
      display: none;
    }
  }
  
  .stats-grid {
    gap: $spacing-4;
  }
  
  .charts-section {
    gap: $spacing-4;
  }
}
</style>
