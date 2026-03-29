<template>
  <div class="page-container mineral-detect-page">
    <h2 class="page-title">矿物识别</h2>
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <!-- 图像输入卡片 -->
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
        <!-- 识别结果卡片 -->
        <el-card shadow="hover" class="result-card">
          <template #header>
            <span>识别结果</span>
          </template>
          <!-- 加载状态 -->
          <div v-if="mineralStore.isDetecting" class="loading-state">
            <el-icon class="loading-icon" :size="48"><Loading /></el-icon>
            <p>正在识别中，请稍候...</p>
          </div>
          <!-- 空状态 -->
          <div v-else-if="!mineralStore.detectionResult" class="empty-state">
            <el-icon :size="48" color="#c0c4cc"><PictureFilled /></el-icon>
            <p>请先上传图片或拍摄照片进行矿物识别</p>
          </div>
          <!-- 结果展示 -->
          <div v-else class="result-content">
            <!-- 检测结果画布 -->
            <DetectionCanvas
              v-if="mineralStore.imagePreviewUrl"
              :image-url="mineralStore.imagePreviewUrl"
              :results="mineralStore.detectionResult.results"
            />
            <!-- 矿物列表 -->
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

/**
 * 矿物识别页面组件
 * 提供图片上传和摄像头拍摄两种方式进行矿物识别
 */

// 路由和状态管理
const router = useRouter()
const mineralStore = useMineralStore()

// 当前激活的标签页
const activeTab = ref('upload')

/**
 * 处理矿物识别
 * 调用矿物store的detect方法进行识别
 */
async function handleDetect() {
  await mineralStore.detect()
}

/**
 * 跳转到AI问答页面
 * @param mineralName 矿物名称
 */
function goAskAI(mineralName: string) {
  router.push({ path: '/chat', query: { mineral: mineralName, detectId: mineralStore.detectionResult?.detectId } })
}

/**
 * 跳转到矿物详情页面
 * @param mineralName 矿物名称
 */
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
