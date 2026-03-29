<template>
  <div class="image-uploader">
    <!-- 图片上传区域 -->
    <el-upload
      ref="uploadRef"
      class="upload-area"
      drag
      :auto-upload="false" <!-- 关闭自动上传，手动控制 -->
      :show-file-list="false" <!-- 隐藏文件列表 -->
      accept="image/jpeg,image/png,image/webp" <!-- 支持的图片格式 -->
      :on-change="handleChange" <!-- 文件选择变化时的回调 -->
    >
      <!-- 上传占位符 -->
      <div v-if="!previewUrl" class="upload-placeholder">
        <el-icon :size="48" color="#c0c4cc"><UploadFilled /></el-icon>
        <p>将图片拖到此处，或<em>点击上传</em></p>
        <p class="upload-tip">支持 JPG/PNG/WEBP 格式，大小不超过 10MB</p>
      </div>
      <!-- 图片预览 -->
      <div v-else class="upload-preview">
        <img :src="previewUrl" alt="预览" />
      </div>
    </el-upload>
    <!-- 上传操作按钮 -->
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

/**
 * 组件属性
 */
defineProps<{
  detecting: boolean // 识别中状态
}>()

/**
 * 组件事件
 */
defineEmits(['detect']) // 开始识别事件

// 矿物识别状态管理
const mineralStore = useMineralStore()
// 图片预览 URL，从状态管理中获取
const previewUrl = computed(() => mineralStore.imagePreviewUrl)

/**
 * 文件选择变化处理
 * @param file - 上传的文件对象
 * @description 处理文件选择，验证文件大小并保存到状态管理
 */
function handleChange(file: UploadFile) {
  if (!file.raw) return
  
  // 验证文件大小
  if (file.raw.size > 10 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过10MB')
    return
  }
  
  // 保存文件到状态管理
  mineralStore.setImage(file.raw)
}

/**
 * 清除图片
 * @description 清除当前选择的图片和识别结果
 */
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
