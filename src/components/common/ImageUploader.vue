<template>
  <div class="image-uploader">
    <el-upload
      ref="uploadRef"
      class="upload-area"
      drag
      :auto-upload="false"
      :show-file-list="false"
      accept="image/jpeg,image/png,image/webp"
      :on-change="handleChange"
      :disabled="detecting"
    >
      <div v-if="!previewUrl" class="upload-placeholder">
        <div class="upload-icon-wrapper">
          <div class="upload-icon-bg"></div>
          <el-icon class="upload-icon" :size="40"><UploadFilled /></el-icon>
        </div>
        <div class="upload-text">
          <p class="upload-title">将图片拖到此处，或<em>点击上传</em></p>
          <p class="upload-tip">支持 JPG/PNG/WEBP 格式，大小不超过 10MB</p>
        </div>
        <div class="upload-features">
          <div class="feature-item">
            <el-icon><PictureFilled /></el-icon>
            <span>高清识别</span>
          </div>
          <div class="feature-item">
            <el-icon><Aim /></el-icon>
            <span>精准分析</span>
          </div>
          <div class="feature-item">
            <el-icon><Clock /></el-icon>
            <span>秒级响应</span>
          </div>
        </div>
      </div>
      
      <div v-else class="upload-preview">
        <div class="preview-container">
          <img :src="previewUrl" alt="预览" />
          <div class="preview-overlay">
            <el-button circle size="small" @click.stop="clearImage">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="preview-info">
          <div class="info-item">
            <el-icon><PictureFilled /></el-icon>
            <span>{{ fileName }}</span>
          </div>
          <div class="info-item">
            <el-icon><Document /></el-icon>
            <span>{{ fileSize }}</span>
          </div>
        </div>
      </div>
    </el-upload>
    
    <transition name="slide-up">
      <div v-if="previewUrl && !detecting" class="upload-actions">
        <el-button size="large" @click="clearImage">
          <el-icon><RefreshLeft /></el-icon>
          重新选择
        </el-button>
        <el-button 
          size="large" 
          type="primary" 
          class="detect-btn"
          @click="$emit('detect')"
        >
          <el-icon><Search /></el-icon>
          开始识别
        </el-button>
      </div>
    </transition>
    
    <div v-if="detecting" class="detecting-hint">
      <div class="detecting-animation">
        <div class="pulse-ring"></div>
        <div class="pulse-ring"></div>
        <el-icon class="detecting-icon" :size="24"><Loading /></el-icon>
      </div>
      <span>正在识别中，请稍候...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useMineralStore } from '@/stores/mineral'

defineProps<{
  detecting: boolean
}>()

defineEmits(['detect'])

const mineralStore = useMineralStore()
const uploadRef = ref()
const currentFile = ref<File | null>(null)

const previewUrl = computed(() => mineralStore.imagePreviewUrl)

const fileName = computed(() => currentFile.value?.name || '未知文件')
const fileSize = computed(() => {
  if (!currentFile.value) return '未知大小'
  const size = currentFile.value.size
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
})

function handleChange(file: UploadFile) {
  if (!file.raw) return
  
  if (file.raw.size > 10 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过10MB')
    return
  }
  
  currentFile.value = file.raw
  mineralStore.setImage(file.raw)
}

function clearImage() {
  currentFile.value = null
  mineralStore.clearResult()
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.image-uploader {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.upload-area {
  flex: 0 0 auto;
  max-height: 320px;
  
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
  }
  
  :deep(.el-upload-dragger) {
    width: 100%;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed $gray-200;
    border-radius: $radius-xl;
    background: $gray-50;
    transition: $transition-fast;
    overflow: hidden;
    
    &:hover {
      border-color: $primary-400;
      background: rgba($primary-500, 0.02);
    }
    
    &.is-dragover {
      border-color: $primary-500;
      background: rgba($primary-500, 0.05);
    }
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-8;
  text-align: center;
}

.upload-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: $spacing-5;
}

.upload-icon-bg {
  position: absolute;
  inset: 0;
  background: $gradient-primary;
  border-radius: 50%;
  opacity: 0.1;
  animation: pulse-bg 2s ease-in-out infinite;
}

@keyframes pulse-bg {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.1); opacity: 0.15; }
}

.upload-icon {
  position: relative;
  z-index: 1;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-primary;
  border-radius: 50%;
  color: white;
  box-shadow: $shadow-primary;
}

.upload-text {
  margin-bottom: $spacing-5;
  
  .upload-title {
    font-size: $font-size-base;
    color: $gray-600;
    margin: 0 0 $spacing-2;
    
    em {
      color: $primary-500;
      font-style: normal;
      font-weight: $font-weight-medium;
    }
  }
  
  .upload-tip {
    font-size: $font-size-xs;
    color: $gray-400;
    margin: 0;
  }
}

.upload-features {
  display: flex;
  gap: $spacing-6;
  
  .feature-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-2;
    
    .el-icon {
      font-size: 20px;
      color: $primary-500;
    }
    
    span {
      font-size: $font-size-xs;
      color: $gray-500;
    }
  }
}

.upload-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-4;
  height: 320px;
  max-height: 320px;
  overflow: hidden;
  box-sizing: border-box;
}

.preview-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 220px;
  max-height: 220px;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
  flex-shrink: 0;
  
  img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .preview-overlay {
    position: absolute;
    top: $spacing-2;
    right: $spacing-2;
    opacity: 0;
    transition: $transition-fast;
  }
  
  &:hover .preview-overlay {
    opacity: 1;
  }
}

.preview-info {
  display: flex;
  gap: $spacing-4;
  margin-top: $spacing-3;
  
  .info-item {
    display: flex;
    align-items: center;
    gap: $spacing-1;
    font-size: $font-size-xs;
    color: $gray-500;
    
    .el-icon {
      font-size: 14px;
      color: $primary-500;
    }
  }
}

.upload-actions {
  display: flex;
  gap: $spacing-3;
  justify-content: center;
  padding-top: $spacing-4;
  border-top: 1px solid $gray-100;
  
  .el-button {
    flex: 1;
    max-width: 160px;
    height: 44px;
    font-weight: $font-weight-medium;
  }
  
  .detect-btn {
    background: $gradient-primary;
    border: none;
    transition: $transition-slow;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-primary;
    }
  }
}

.detecting-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-3;
  padding: $spacing-4;
  background: rgba($primary-500, 0.05);
  border-radius: $radius-lg;
  color: $primary-600;
  font-size: $font-size-sm;
}

.detecting-animation {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulse-ring {
  position: absolute;
  inset: 0;
  border: 2px solid $primary-500;
  border-radius: 50%;
  animation: pulse-ring 1.5s ease-out infinite;
  
  &:nth-child(2) {
    animation-delay: 0.5s;
  }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.detecting-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s $ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: $breakpoint-sm) {
  .upload-features {
    flex-direction: column;
    gap: $spacing-3;
  }
  
  .upload-actions {
    flex-direction: column;
    
    .el-button {
      max-width: none;
    }
  }
}
</style>
