<template>
  <div class="data-section">
    <div class="section-block">
      <h4 class="block-title">
        <el-icon><Download /></el-icon>
        数据导出
      </h4>
      <p class="block-desc">导出您的所有数据，包括识别记录、问答历史等</p>
      <el-button type="primary" @click="$emit('export')">
        <el-icon><Download /></el-icon>
        导出我的数据
      </el-button>
    </div>

    <div class="section-block">
      <h4 class="block-title">
        <el-icon><Delete /></el-icon>
        清除历史记录
      </h4>
      <p class="block-desc">清除您的使用记录，此操作不可恢复</p>
      <div class="action-group">
        <el-button @click="$emit('clear-history', 'detect')">清除识别历史</el-button>
        <el-button @click="$emit('clear-history', 'chat')">清除问答历史</el-button>
        <el-button type="danger" plain @click="$emit('clear-history', 'all')">清除全部</el-button>
      </div>
    </div>

    <div class="section-block danger-zone">
      <h4 class="block-title">
        <el-icon><Warning /></el-icon>
        危险操作
      </h4>
      <p class="block-desc">注销账户将删除所有数据，此操作不可恢复</p>
      <el-button type="danger" @click="$emit('delete-account')">
        <el-icon><Warning /></el-icon>
        注销账户
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'export'): void
  (e: 'clear-history', type: 'detect' | 'chat' | 'all'): void
  (e: 'delete-account'): void
}>()
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.data-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
}

.section-block {
  padding-bottom: $spacing-6;
  border-bottom: 1px solid $gray-100;

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.block-title {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-800;
  margin: 0 0 $spacing-1;

  .el-icon { color: $primary-500; }
}

.block-desc {
  font-size: $font-size-sm;
  color: $gray-500;
  margin: 0 0 $spacing-4;
}

.action-group {
  display: flex;
  gap: $spacing-3;
  flex-wrap: wrap;
}

.danger-zone {
  background: rgba($danger-color, 0.05);
  padding: $spacing-5;
  border-radius: $radius-lg;
  border: 1px solid rgba($danger-color, 0.2);

  .block-title {
    color: $danger-color;

    .el-icon { color: $danger-color; }
  }
}
</style>
