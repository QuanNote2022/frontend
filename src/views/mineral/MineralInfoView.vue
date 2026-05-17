<template>
  <div class="page-container">
    <div class="page-header">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading" :size="36"><Loading /></el-icon>
      <span>加载矿物信息...</span>
    </div>

    <div v-else-if="mineralInfo" class="mineral-content">
      <div class="mineral-hero">
        <div class="hero-icon">
          <el-icon :size="48"><Collection /></el-icon>
        </div>
        <h1 class="mineral-name">{{ mineralInfo.name }}</h1>
        <p class="mineral-formula">{{ mineralInfo.formula }}</p>
      </div>

      <el-card class="info-card" shadow="hover">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="化学式">{{ mineralInfo.formula }}</el-descriptions-item>
          <el-descriptions-item label="硬度">{{ mineralInfo.hardness }}</el-descriptions-item>
          <el-descriptions-item label="光泽">{{ mineralInfo.luster }}</el-descriptions-item>
          <el-descriptions-item label="颜色">{{ mineralInfo.color }}</el-descriptions-item>
          <el-descriptions-item label="产地">{{ mineralInfo.origin }}</el-descriptions-item>
          <el-descriptions-item label="用途">{{ mineralInfo.uses }}</el-descriptions-item>
        </el-descriptions>

        <div class="description-section">
          <h3>描述</h3>
          <p>{{ mineralInfo.description }}</p>
        </div>
      </el-card>

      <div class="action-bar">
        <el-button type="primary" size="large" @click="askAI">
          <el-icon><ChatDotRound /></el-icon>
          向 AI 提问
        </el-button>
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty description="矿物信息不存在" />
      <el-button type="primary" @click="router.push('/')">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMineralInfoApi } from '@/api/mineral'
import type { MineralInfo } from '@/types/mineral'
import { ArrowLeft, ChatDotRound, Collection, Loading } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const mineralInfo = ref<MineralInfo | null>(null)
const loading = ref(true)

onMounted(async () => {
  const name = decodeURIComponent(route.params.name as string)
  try {
    const res = await getMineralInfoApi(name)
    mineralInfo.value = res.data
  } catch {
    mineralInfo.value = null
  } finally {
    loading.value = false
  }
})

function askAI() {
  if (mineralInfo.value) {
    router.push(`/chat?mineral=${encodeURIComponent(mineralInfo.value.name)}`)
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing-6;
}

.page-header {
  margin-bottom: $spacing-6;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-20 0;
  color: $gray-400;
  font-size: $font-size-sm;
}

.mineral-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
}

.mineral-hero {
  text-align: center;
  padding: $spacing-8 0 $spacing-4;

  .hero-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto $spacing-4;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gradient-primary;
    border-radius: $radius-2xl;
    color: white;
    box-shadow: $shadow-primary;
  }

  .mineral-name {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    margin: 0 0 $spacing-2;
    @include gradient-text;
  }

  .mineral-formula {
    font-size: $font-size-lg;
    color: $gray-500;
    font-family: $font-mono;
    margin: 0;
  }
}

.info-card {
  :deep(.el-card__body) {
    padding: $spacing-6;
  }
}

.description-section {
  margin-top: $spacing-6;

  h3 {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-700;
    margin: 0 0 $spacing-3;
  }

  p {
    font-size: $font-size-sm;
    color: $gray-600;
    line-height: $line-height-relaxed;
    margin: 0;
  }
}

.action-bar {
  display: flex;
  justify-content: center;
  padding: $spacing-4 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-6;
  padding: $spacing-20 0;
}
</style>
