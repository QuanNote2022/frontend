<template>
  <div class="page-container mineral-detect-page">
    <h2 class="page-title">矿物识别</h2>
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="input-card">
          <template #header>
            <span>图像输入</span>
          </template>
          <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="上传图片" name="upload">
              <ImageUploader :detecting="mineralStore.isDetecting" @detect="handleDetect" />
            </el-tab-pane>
            <el-tab-pane label="摄像头拍摄" name="camera">
              <CameraCapture :detecting="mineralStore.isDetecting" @detect="handleDetect" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="result-card">
          <template #header>
            <span>识别结果</span>
          </template>
          <div v-if="mineralStore.isDetecting" class="loading-state">
            <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
            <p>正在识别中，请稍候...</p>
          </div>
          <div v-else-if="!mineralStore.detectionResult" class="empty-state">
            <el-icon :size="48" color="#c0c4cc"><PictureFilled /></el-icon>
            <p>请先上传图片或拍摄照片进行矿物识别</p>
          </div>
          <div v-else class="result-content">
            <DetectionCanvas
              v-if="mineralStore.imagePreviewUrl"
              :image-url="mineralStore.imagePreviewUrl"
              :results="mineralStore.detectionResult.results"
            />
            <div class="result-list">
              <h4>识别到 {{ mineralStore.detectionResult.results.length }} 种矿物：</h4>
              <MineralCard
                v-for="r in mineralStore.detectionResult.results"
                :key="r.label"
                :result="r"
                @ask-ai="goAskAI"
                @view-detail="goDetail"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMineralStore } from '@/stores/mineral'
import ImageUploader from '@/components/common/ImageUploader.vue'
import CameraCapture from '@/components/common/CameraCapture.vue'
import DetectionCanvas from '@/components/common/DetectionCanvas.vue'
import MineralCard from '@/components/common/MineralCard.vue'

const router = useRouter()
const mineralStore = useMineralStore()
const activeTab = ref('upload')

async function handleDetect() {
  await mineralStore.detect()
}

function goAskAI(mineralName: string) {
  router.push({ path: '/chat', query: { mineral: mineralName, detectId: mineralStore.detectionResult?.detectId } })
}

function goDetail(mineralName: string) {
  router.push({ path: `/detect/${mineralStore.detectionResult?.detectId}`, query: { mineral: mineralName } })
}
</script>

<style scoped lang="scss">
.mineral-detect-page {
  .page-title {
    font-size: 20px;
    margin-bottom: 20px;
    color: #303133;
  }
}
.input-card, .result-card {
  min-height: 480px;
}
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  .loading-icon {
    animation: rotate 1.5s linear infinite;
    color: #409eff;
  }
  p { margin-top: 16px; color: #909399; }
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  p { margin-top: 16px; color: #909399; font-size: 14px; }
}
.result-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.result-list {
  h4 { font-size: 15px; color: #303133; margin-bottom: 12px; }
}
</style>
