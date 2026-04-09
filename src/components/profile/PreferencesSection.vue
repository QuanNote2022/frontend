<template>
  <div class="preferences-section">
    <div class="preference-group">
      <h4 class="group-title">
        <el-icon><Bell /></el-icon>
        通知设置
      </h4>
      <div class="preference-item">
        <div class="preference-info">
          <span class="preference-label">邮件通知</span>
          <span class="preference-desc">接收重要通知和更新提醒</span>
        </div>
        <el-switch
          v-model="localPreferences.emailNotification"
          @change="handleUpdate('emailNotification', $event)"
        />
      </div>
      <div class="preference-item">
        <div class="preference-info">
          <span class="preference-label">系统通知</span>
          <span class="preference-desc">接收系统消息和活动通知</span>
        </div>
        <el-switch
          v-model="localPreferences.systemNotification"
          @change="handleUpdate('systemNotification', $event)"
        />
      </div>
    </div>

    <div class="preference-group">
      <h4 class="group-title">
        <el-icon><Setting /></el-icon>
        界面设置
      </h4>
      <div class="preference-item">
        <div class="preference-info">
          <span class="preference-label">界面主题</span>
          <span class="preference-desc">选择您喜欢的界面主题</span>
        </div>
        <el-radio-group v-model="localPreferences.theme" @change="handleUpdate('theme', $event)">
          <el-radio-button value="light">浅色</el-radio-button>
          <el-radio-button value="dark">深色</el-radio-button>
          <el-radio-button value="auto">跟随系统</el-radio-button>
        </el-radio-group>
      </div>
      <div class="preference-item">
        <div class="preference-info">
          <span class="preference-label">语言设置</span>
          <span class="preference-desc">选择界面显示语言</span>
        </div>
        <el-select v-model="localPreferences.language" @change="handleUpdate('language', $event)">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { UserPreferences } from '@/types/user'

const props = defineProps<{
  preferences: UserPreferences
  loading: boolean
}>()

const emit = defineEmits<{ (e: 'update', data: Partial<UserPreferences>): void }>()

const localPreferences = reactive({ ...props.preferences })

watch(() => props.preferences, (val) => {
  Object.assign(localPreferences, val)
}, { deep: true })

function handleUpdate(key: keyof UserPreferences, value: string | boolean) {
  emit('update', { [key]: value })
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.preferences-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
}

.preference-group {
  padding-bottom: $spacing-6;
  border-bottom: 1px solid $gray-100;

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.group-title {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-800;
  margin: 0 0 $spacing-4;

  .el-icon { color: $primary-500; }
}

.preference-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $radius-lg;
  margin-bottom: $spacing-3;

  &:last-child {
    margin-bottom: 0;
  }
}

.preference-info {
  display: flex;
  flex-direction: column;
}

.preference-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-800;
}

.preference-desc {
  font-size: $font-size-xs;
  color: $gray-500;
  margin-top: 2px;
}
</style>
