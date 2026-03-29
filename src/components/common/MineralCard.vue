<template>
  <el-card class="mineral-card" shadow="hover">
    <!-- 卡片头部：矿物名称和置信度 -->
    <div class="card-header">
      <span class="mineral-name">{{ result.label }}</span>
      <el-tag :type="confidenceType" size="small">{{ formatPercent(result.confidence) }}</el-tag>
    </div>
    <!-- 置信度进度条 -->
    <el-progress :percentage="Math.round(result.confidence * 100)" :color="confidenceColor" :stroke-width="6" />
    <!-- 矿物基本信息 -->
    <div v-if="result.mineralInfo" class="card-info">
      <p><strong>化学式：</strong>{{ result.mineralInfo.formula }}</p>
      <p><strong>硬度：</strong>{{ result.mineralInfo.hardness }}</p>
      <p><strong>光泽：</strong>{{ result.mineralInfo.luster }}</p>
    </div>
    <!-- 操作按钮 -->
    <div class="card-actions">
      <el-button type="primary" size="small" text @click="$emit('ask-ai', result.label)">
        <el-icon><ChatDotRound /></el-icon>问问 AI
      </el-button>
      <el-button size="small" text @click="$emit('view-detail', result.label)">
        <el-icon><View /></el-icon>详情
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DetectionResult } from '@/types/mineral'
import { formatPercent } from '@/utils/format'

/**
 * 组件属性
 */
const props = defineProps<{
  result: DetectionResult // 矿物识别结果
}>()

/**
 * 组件事件
 */
defineEmits(['ask-ai', 'view-detail']) // 问问 AI 和查看详情事件

/**
 * 置信度标签类型
 * @description 根据置信度值返回不同的标签类型
 */
const confidenceType = computed(() => {
  if (props.result.confidence >= 0.9) return 'success' // 高置信度
  if (props.result.confidence >= 0.7) return 'warning' // 中等置信度
  return 'danger' // 低置信度
})

/**
 * 置信度颜色
 * @description 根据置信度值返回不同的颜色
 */
const confidenceColor = computed(() => {
  if (props.result.confidence >= 0.9) return '#67c23a' // 绿色
  if (props.result.confidence >= 0.7) return '#e6a23c' // 黄色
  return '#f56c6c' // 红色
})
</script>

<style scoped lang="scss">
.mineral-card {
  margin-bottom: 12px;
  :deep(.el-card__body) { padding: 16px; }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.mineral-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-info {
  margin-top: 12px;
  p {
    font-size: 13px;
    color: #606266;
    margin: 4px 0;
    strong { color: #303133; }
  }
}

.card-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
</style>
