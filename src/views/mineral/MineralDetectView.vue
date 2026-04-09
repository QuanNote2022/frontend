<template>
  <div class="detect-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">
          <el-icon><Camera /></el-icon>
          <span>AI 驱动</span>
        </div>
        <h2 class="page-title">矿物识别</h2>
        <p class="page-subtitle">上传图片或使用摄像头，AI 将自动识别矿物类型</p>
      </div>
    </div>

    <div class="detect-content">
      <div class="input-section">
        <div class="section-card">
          <div class="card-header">
            <h3 class="card-title">
              <el-icon><Upload /></el-icon>
              图像输入
            </h3>
            <div class="step-indicator">
              <span class="step" :class="{ active: currentStep >= 1, completed: previewUrl }">1. 上传</span>
              <span class="step-arrow">→</span>
              <span class="step" :class="{ active: currentStep >= 2, completed: detectionResult }">2. 识别</span>
              <span class="step-arrow">→</span>
              <span class="step" :class="{ active: currentStep >= 3 }">3. 结果</span>
            </div>
          </div>
          
          <el-tabs v-model="activeTab" class="input-tabs">
            <el-tab-pane name="upload">
              <template #label>
                <span class="tab-label">
                  <el-icon><Upload /></el-icon>
                  上传图片
                </span>
              </template>
              <ImageUploader :detecting="mineralStore.isDetecting" @detect="handleDetect" />
            </el-tab-pane>
            <el-tab-pane name="camera">
              <template #label>
                <span class="tab-label">
                  <el-icon><VideoCamera /></el-icon>
                  摄像头拍摄
                </span>
              </template>
              <CameraCapture :detecting="mineralStore.isDetecting" @detect="handleDetect" />
            </el-tab-pane>
          </el-tabs>
          
          <div class="input-tips">
            <div class="tip-item">
              <el-icon><PictureFilled /></el-icon>
              <span>支持 JPG、PNG、WEBP 格式</span>
            </div>
            <div class="tip-item">
              <el-icon><Document /></el-icon>
              <span>图片大小不超过 10MB</span>
            </div>
            <div class="tip-item">
              <el-icon><Aim /></el-icon>
              <span>建议拍摄清晰的矿物特写</span>
            </div>
          </div>
        </div>
      </div>

      <div class="result-section">
        <div class="section-card">
          <div class="card-header">
            <h3 class="card-title">
              <el-icon><DataAnalysis /></el-icon>
              识别结果
            </h3>
          </div>
          
          <transition name="fade-scale" mode="out-in">
            <div v-if="mineralStore.isDetecting" class="loading-state">
              <div class="loading-animation">
                <div class="loading-ring"></div>
                <div class="loading-ring"></div>
                <div class="loading-ring"></div>
                <div class="loading-core">
                  <el-icon :size="32"><Aim /></el-icon>
                </div>
              </div>
              <h4 class="loading-title">正在识别中</h4>
              <p class="loading-desc">AI 正在分析矿物特征...</p>
              <div class="loading-progress">
                <div class="progress-bar"></div>
              </div>
            </div>
            
            <div v-else-if="!mineralStore.detectionResult" class="empty-state">
              <div class="empty-illustration">
                <div class="illustration-circle">
                  <el-icon :size="64"><PictureFilled /></el-icon>
                </div>
                <div class="illustration-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <h4 class="empty-title">等待识别</h4>
              <p class="empty-desc">请上传图片或拍摄照片进行矿物识别</p>
            </div>
            
            <div v-else class="result-state">
              <div class="result-preview">
                <DetectionCanvas
                  v-if="mineralStore.imagePreviewUrl"
                  :image-url="mineralStore.imagePreviewUrl"
                  :results="mineralStore.detectionResult.results"
                />
              </div>
              
              <div class="result-list">
                <div class="result-header">
                  <h4 class="result-title">
                    识别到 {{ mineralStore.detectionResult.results.length }} 种矿物
                  </h4>
                  <el-tag type="success" effect="dark" class="result-badge">
                    <el-icon><Check /></el-icon>
                    识别成功
                  </el-tag>
                </div>
                
                <transition-group name="result-item" tag="div" class="mineral-list">
                  <MineralCard
                    v-for="(r, index) in mineralStore.detectionResult.results"
                    :key="r.label"
                    :result="r"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                    @ask-ai="goAskAI"
                    @view-detail="goDetail"
                  />
                </transition-group>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMineralStore } from '@/stores/mineral'
import ImageUploader from '@/components/common/ImageUploader.vue'
import CameraCapture from '@/components/common/CameraCapture.vue'
import DetectionCanvas from '@/components/common/DetectionCanvas.vue'
import MineralCard from '@/components/common/MineralCard.vue'

const router = useRouter()
const mineralStore = useMineralStore()
const activeTab = ref('upload')

const previewUrl = computed(() => mineralStore.imagePreviewUrl)
const detectionResult = computed(() => mineralStore.detectionResult)

const currentStep = computed(() => {
  if (mineralStore.detectionResult) return 3
  if (mineralStore.imagePreviewUrl) return 2
  return 1
})

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
@use '@/assets/styles/variables' as *;

.detect-page {
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
}

.detect-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-6;
  
  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

.section-card {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .card-header {
    padding: $spacing-5 $spacing-6;
    border-bottom: 1px solid $gray-100;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .card-title {
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

.step-indicator {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  
  .step {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    color: $gray-400;
    transition: $transition-fast;
    
    &.active {
      color: $primary-600;
    }
    
    &.completed {
      color: $success-color;
    }
  }
  
  .step-arrow {
    color: $gray-300;
    font-size: $font-size-xs;
  }
}

.input-section {
  .section-card {
    min-height: 560px;
  }
}

.input-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  :deep(.el-tabs__header) {
    margin: 0;
    padding: 0 $spacing-6;
    border-bottom: 1px solid $gray-100;
  }
  
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  
  :deep(.el-tabs__item) {
    padding: $spacing-4 $spacing-6;
    font-weight: $font-weight-medium;
    
    &.is-active {
      color: $primary-600;
    }
  }
  
  :deep(.el-tabs__active-bar) {
    background: $gradient-primary;
    height: 3px;
    border-radius: $radius-full;
  }
  
  :deep(.el-tabs__content) {
    flex: 1;
    padding: $spacing-6;
  }
  
  :deep(.el-tab-pane) {
    height: 100%;
  }
}

.tab-label {
  display: flex;
  align-items: center;
  gap: $spacing-2;
}

.input-tips {
  display: flex;
  gap: $spacing-4;
  padding: $spacing-4 $spacing-6;
  background: $gray-50;
  border-top: 1px solid $gray-100;
  
  .tip-item {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    font-size: $font-size-xs;
    color: $gray-500;
    
    .el-icon { color: $primary-500; }
  }
  
  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    gap: $spacing-2;
  }
}

.result-section {
  .section-card {
    min-height: 560px;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-12;
  height: 100%;
}

.loading-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: $spacing-6;
}

.loading-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  
  &:nth-child(1) {
    border-top-color: $primary-500;
    animation: spin 1.5s linear infinite;
  }
  
  &:nth-child(2) {
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    border-right-color: $secondary-500;
    animation: spin 1.5s linear infinite reverse;
  }
  
  &:nth-child(3) {
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
    border-bottom-color: $accent-500;
    animation: spin 1.5s linear infinite;
  }
}

.loading-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-primary;
  border-radius: 50%;
  color: white;
  box-shadow: $shadow-primary;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $gray-800;
  margin: 0 0 $spacing-2;
}

.loading-desc {
  font-size: $font-size-sm;
  color: $gray-500;
  margin: 0 0 $spacing-6;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: $gray-100;
  border-radius: $radius-full;
  overflow: hidden;
  
  .progress-bar {
    height: 100%;
    background: $gradient-primary;
    border-radius: $radius-full;
    animation: progress 2s ease-in-out infinite;
  }
}

@keyframes progress {
  0% { width: 0%; margin-left: 0; }
  50% { width: 70%; margin-left: 0; }
  100% { width: 0%; margin-left: 100%; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-12;
  height: 100%;
}

.empty-illustration {
  position: relative;
  margin-bottom: $spacing-6;
  
  .illustration-circle {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gray-50;
    border-radius: 50%;
    color: $gray-300;
    @include float-animation(8px, 3s);
  }
  
  .illustration-dots {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: $spacing-2;
    
    span {
      width: 8px;
      height: 8px;
      background: $gray-200;
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite;
      
      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
}

.empty-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $gray-700;
  margin: 0 0 $spacing-2;
}

.empty-desc {
  font-size: $font-size-sm;
  color: $gray-500;
  margin: 0;
}

.result-state {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.result-preview {
  padding: $spacing-4;
  background: $gray-50;
  border-bottom: 1px solid $gray-100;
}

.result-list {
  flex: 1;
  padding: $spacing-4;
  overflow-y: auto;
  @include custom-scrollbar();
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-4;
}

.result-title {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-800;
  margin: 0;
}

.result-badge {
  background: $gradient-accent;
  border: none;
  
  .el-icon { margin-right: $spacing-1; }
}

.mineral-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
}

.result-item-enter-active {
  transition: all 0.4s $ease-out;
}

.result-item-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s $ease-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: $breakpoint-md) {
  .page-header {
    padding: $spacing-6 $spacing-4;
    
    .page-title {
      font-size: $font-size-2xl;
    }
  }
  
  .detect-content {
    gap: $spacing-4;
  }
  
  .input-section .section-card,
  .result-section .section-card {
    min-height: 400px;
  }
  
  .step-indicator {
    display: none;
  }
}
</style>
