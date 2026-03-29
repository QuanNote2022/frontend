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
    >
      <div v-if="!previewUrl" class="upload-placeholder">
        <el-icon :size="48" color="#c0c4cc"><UploadFilled /></el-icon>
        <p>将图片拖到此处，或<em>点击上传</em></p>
        <p class="upload-tip">支持 JPG/PNG/WEBP 格式，大小不超过 10MB</p>
      </div>
      <div v-else class="upload-preview">
        <img :src="previewUrl" alt="预览" />
      </div>
    </el-upload>
    <div v-if="previewUrl" class="upload-actions">
      <el-button @click="clearImage">重新选择</el-button>
      <el-button type="primary" :loading="detecting" @click="$emit('detect')">
        <el-icon><Search /></el-icon>开始识别
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { useMineralStore } from '@/stores/mineral'

defineProps<{ detecting: boolean }>()
defineEmits(['detect'])

const mineralStore = useMineralStore()
const previewUrl = computed(() => mineralStore.imagePreviewUrl)

function handleChange(file: UploadFile) {
  if (!file.raw) return
  if (file.raw.size > 10 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过10MB')
    return
  }
  mineralStore.setImage(file.raw)
}

function clearImage() {
  mineralStore.clearResult()
}
</script>

<style scoped lang="scss">
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.upload-area {
  width: 100%;
  :deep(.el-upload) { width: 100%; }
  :deep(.el-upload-dragger) {
    width: 100%;
    min-height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
}
.upload-placeholder {
  text-align: center;
  p { color: #909399; margin-top: 8px; font-size: 14px; }
  em { color: #409eff; font-style: normal; }
  .upload-tip { font-size: 12px; color: #c0c4cc; }
}
.upload-preview {
  width: 100%;
  img {
    max-width: 100%;
    max-height: 360px;
    object-fit: contain;
    border-radius: 4px;
  }
}
.upload-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
