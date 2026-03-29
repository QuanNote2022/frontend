<template>
  <div class="page-container">
    <div class="page-header">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <h2 class="page-title">识别结果详情</h2>
    </div>

    <div v-if="loading" class="loading-state">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
    </div>

    <template v-else-if="mineralStore.detectionResult">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header><span>检测图像</span></template>
            <DetectionCanvas
              v-if="mineralStore.imagePreviewUrl"
              :image-url="mineralStore.imagePreviewUrl"
              :results="mineralStore.detectionResult.results"
            />
            <div v-else class="no-image">
              <el-icon :size="48" color="#c0c4cc"><PictureFilled /></el-icon>
              <p>原图预览不可用</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card v-for="r in mineralStore.detectionResult.results" :key="r.label" shadow="hover" class="detail-card">
            <template #header>
              <div class="detail-header">
                <span class="mineral-name">{{ r.label }}</span>
                <el-tag type="success">置信度 {{ (r.confidence * 100).toFixed(1) }}%</el-tag>
              </div>
            </template>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="化学式">{{ r.mineralInfo.formula }}</el-descriptions-item>
              <el-descriptions-item label="硬度">{{ r.mineralInfo.hardness }}</el-descriptions-item>
              <el-descriptions-item label="光泽">{{ r.mineralInfo.luster }}</el-descriptions-item>
              <el-descriptions-item label="颜色">{{ r.mineralInfo.color }}</el-descriptions-item>
              <el-descriptions-item label="产地" :span="2">{{ r.mineralInfo.origin }}</el-descriptions-item>
              <el-descriptions-item label="用途" :span="2">{{ r.mineralInfo.uses }}</el-descriptions-item>
            </el-descriptions>
            <p class="mineral-desc">{{ r.mineralInfo.description }}</p>
            <el-button type="primary" size="small" style="margin-top: 12px;" @click="goAskAI(r.label)">
              <el-icon><ChatDotRound /></el-icon>基于此结果提问
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <el-empty v-else description="未找到识别记录" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMineralStore } from '@/stores/mineral'
import DetectionCanvas from '@/components/common/DetectionCanvas.vue'

const route = useRoute()
const router = useRouter()
const mineralStore = useMineralStore()
const loading = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  if (!mineralStore.detectionResult || mineralStore.detectionResult.detectId !== id) {
    loading.value = true
    try {
      await mineralStore.fetchDetail(id)
    } finally {
      loading.value = false
    }
  }
})

function goAskAI(mineralName: string) {
  router.push({ path: '/chat', query: { mineral: mineralName } })
}
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.page-title {
  font-size: 20px;
  color: #303133;
  margin: 0;
}
.detail-card {
  margin-bottom: 16px;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mineral-name {
  font-size: 18px;
  font-weight: 600;
}
.mineral-desc {
  margin-top: 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
.loading-state {
  display: flex;
  justify-content: center;
  padding: 60px;
}
.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  p { color: #909399; margin-top: 8px; }
}
</style>
