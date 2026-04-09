<template>
  <div class="achievements-section">
    <div class="achievement-stats">
      <div class="stat-item">
        <span class="stat-value">{{ unlockedCount }}</span>
        <span class="stat-label">已获得</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ achievements.length }}</span>
        <span class="stat-label">总成就</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ progressPercent }}%</span>
        <span class="stat-label">完成度</span>
      </div>
    </div>

    <div class="achievement-grid">
      <div
        v-for="a in achievements"
        :key="a.achievementId"
        class="achievement-card"
        :class="{ unlocked: a.unlocked }"
      >
        <div class="achievement-icon">{{ a.icon }}</div>
        <div class="achievement-info">
          <div class="achievement-name">{{ a.name }}</div>
          <div class="achievement-desc">{{ a.description }}</div>
          <div class="achievement-progress" v-if="!a.unlocked">
            <el-progress
              :percentage="Math.round((a.progress / a.targetProgress) * 100)"
              :show-text="false"
            />
            <span class="progress-text">{{ a.progress }} / {{ a.targetProgress }}</span>
          </div>
          <div class="achievement-time" v-else>
            <el-icon><CircleCheck /></el-icon>
            已获得
          </div>
        </div>
        <div class="achievement-level">
          <span v-for="i in a.level" :key="i" class="level-star">⭐</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Achievement } from '@/types/user'

const props = defineProps<{ achievements: Achievement[] }>()

const unlockedCount = computed(() => props.achievements.filter((a) => a.unlocked).length)
const progressPercent = computed(() =>
  Math.round((unlockedCount.value / props.achievements.length) * 100)
)
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.achievements-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
}

.achievement-stats {
  display: flex;
  gap: $spacing-6;
  padding: $spacing-5;
  background: $gradient-primary;
  border-radius: $radius-xl;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  .stat-value {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: white;
  }

  .stat-label {
    font-size: $font-size-sm;
    color: rgba(255, 255, 255, 0.8);
  }
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-4;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
  }
}

.achievement-card {
  display: flex;
  gap: $spacing-4;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $radius-lg;
  border: 2px solid transparent;
  transition: $transition-fast;
  position: relative;

  &.unlocked {
    background: rgba($primary-500, 0.05);
    border-color: rgba($primary-500, 0.2);
  }

  &:not(.unlocked) {
    opacity: 0.7;
  }
}

.achievement-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-primary;
  border-radius: $radius-lg;
  font-size: 24px;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $gray-800;
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: $font-size-xs;
  color: $gray-500;
  margin-bottom: $spacing-2;
}

.achievement-progress {
  display: flex;
  align-items: center;
  gap: $spacing-2;

  .el-progress { flex: 1; }

  .progress-text {
    font-size: $font-size-xs;
    color: $gray-500;
    white-space: nowrap;
  }
}

.achievement-time {
  display: flex;
  align-items: center;
  gap: $spacing-1;
  font-size: $font-size-xs;
  color: $success-color;
}

.achievement-level {
  position: absolute;
  top: $spacing-2;
  right: $spacing-2;
}

.level-star { font-size: 10px; }
</style>
