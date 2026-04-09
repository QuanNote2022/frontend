<template>
  <div class="mineral-card" :class="{ 'high-confidence': result.confidence >= 0.9 }">
    <div class="card-main">
      <div class="card-left">
        <div class="confidence-ring" :style="ringStyle">
          <svg viewBox="0 0 36 36">
            <path
              class="ring-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="ring-fill"
              :stroke="confidenceColor"
              :stroke-dasharray="`${confidencePercent}, 100`"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span class="ring-value">{{ confidencePercent }}%</span>
        </div>
      </div>
      
      <div class="card-center">
        <div class="mineral-header">
          <h4 class="mineral-name">{{ result.label }}</h4>
          <el-tag :type="confidenceType" size="small" effect="light">
            {{ confidenceLabel }}
          </el-tag>
        </div>
        
        <div v-if="result.mineralInfo" class="mineral-info">
          <div class="info-row">
            <span class="info-label">化学式</span>
            <span class="info-value">{{ result.mineralInfo.formula }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">硬度</span>
            <span class="info-value">{{ result.mineralInfo.hardness }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">光泽</span>
            <span class="info-value">{{ result.mineralInfo.luster }}</span>
          </div>
        </div>
        
        <div v-else class="mineral-placeholder">
          <span>暂无详细信息</span>
        </div>
      </div>
      
      <div class="card-right">
        <el-tooltip content="向 AI 提问关于此矿物的问题" placement="top">
          <button class="action-btn primary" @click="$emit('ask-ai', result.label)">
            <el-icon><ChatDotRound /></el-icon>
          </button>
        </el-tooltip>
        <el-tooltip content="查看详细信息" placement="top">
          <button class="action-btn" @click="$emit('view-detail', result.label)">
            <el-icon><View /></el-icon>
          </button>
        </el-tooltip>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="confidence-bar">
        <div 
          class="confidence-fill" 
          :style="{ width: `${confidencePercent}%`, background: confidenceColor }"
        ></div>
      </div>
      <span class="confidence-text">置信度 {{ confidencePercent }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DetectionResult } from '@/types/mineral'

const props = defineProps<{
  result: DetectionResult
}>()

defineEmits(['ask-ai', 'view-detail'])

const confidencePercent = computed(() => Math.round(props.result.confidence * 100))

const confidenceType = computed(() => {
  if (props.result.confidence >= 0.9) return 'success'
  if (props.result.confidence >= 0.7) return 'warning'
  return 'danger'
})

const confidenceLabel = computed(() => {
  if (props.result.confidence >= 0.9) return '高置信度'
  if (props.result.confidence >= 0.7) return '中等置信度'
  return '低置信度'
})

const confidenceColor = computed(() => {
  if (props.result.confidence >= 0.9) return '#10b981'
  if (props.result.confidence >= 0.7) return '#f59e0b'
  return '#ef4444'
})

const ringStyle = computed(() => ({
  '--ring-color': confidenceColor.value
}))
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.mineral-card {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  overflow: hidden;
  transition: $transition-slow;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
    border-color: rgba($primary-500, 0.2);
  }
  
  &.high-confidence {
    border-color: rgba($success-color, 0.3);
    background: linear-gradient(135deg, rgba($success-color, 0.02) 0%, $bg-card 100%);
  }
}

.card-main {
  display: flex;
  gap: $spacing-4;
  padding: $spacing-4;
}

.card-left {
  flex-shrink: 0;
}

.confidence-ring {
  position: relative;
  width: 60px;
  height: 60px;
  
  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  
  .ring-bg {
    fill: none;
    stroke: $gray-100;
    stroke-width: 3;
  }
  
  .ring-fill {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    transition: stroke-dasharray 0.5s $ease-out;
  }
  
  .ring-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    color: $gray-700;
  }
}

.card-center {
  flex: 1;
  min-width: 0;
}

.mineral-header {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  margin-bottom: $spacing-3;
}

.mineral-name {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-800;
  margin: 0;
}

.mineral-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;
}

.info-row {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $font-size-xs;
}

.info-label {
  color: $gray-400;
  min-width: 40px;
}

.info-value {
  color: $gray-600;
  font-weight: $font-weight-medium;
}

.mineral-placeholder {
  font-size: $font-size-xs;
  color: $gray-400;
  font-style: italic;
}

.card-right {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-50;
  border: 1px solid $gray-200;
  border-radius: $radius-lg;
  color: $gray-500;
  cursor: pointer;
  transition: $transition-fast;
  
  &:hover {
    background: $primary-50;
    border-color: $primary-200;
    color: $primary-500;
  }
  
  &.primary {
    background: $gradient-primary;
    border: none;
    color: white;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: $shadow-primary;
    }
  }
}

.card-footer {
  padding: $spacing-3 $spacing-4;
  background: $gray-50;
  border-top: 1px solid $gray-100;
}

.confidence-bar {
  height: 4px;
  background: $gray-200;
  border-radius: $radius-full;
  overflow: hidden;
  margin-bottom: $spacing-1;
}

.confidence-fill {
  height: 100%;
  border-radius: $radius-full;
  transition: width 0.5s $ease-out;
}

.confidence-text {
  font-size: $font-size-xs;
  color: $gray-500;
}

@media (max-width: $breakpoint-sm) {
  .card-main {
    flex-wrap: wrap;
  }
  
  .card-left {
    order: 1;
  }
  
  .card-center {
    order: 2;
    flex: 1;
  }
  
  .card-right {
    order: 3;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
