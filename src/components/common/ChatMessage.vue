<template>
  <div class="chat-message" :class="[`role-${message.role}`]">
    <div class="message-avatar">
      <el-avatar v-if="message.role === 'assistant'" :size="36" style="background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);">
        <el-icon><Service /></el-icon>
      </el-avatar>
      <el-avatar v-else :size="36" style="background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);">
        {{ '我' }}
      </el-avatar>
    </div>
    <div class="message-body">
      <div class="message-content">
        <div v-if="message.role === 'user' && message.documents && message.documents.length > 0" class="message-documents">
          <div class="doc-indicator" v-for="doc in message.documents.slice(0, 3)" :key="doc.documentId">
            <el-icon><Document /></el-icon>
            <span>{{ doc.fileName }}</span>
          </div>
          <div v-if="message.documents.length > 3" class="doc-more">
            +{{ message.documents.length - 3 }} 个文件
          </div>
        </div>
        <MarkdownRenderer v-if="message.role === 'assistant'" :content="message.content" />
        <p v-else>{{ message.content }}</p>
        <span v-if="streaming" class="cursor-blink">|</span>
      </div>
      <div class="message-footer">
        <span class="message-time">{{ formatDate(message.createdAt) }}</span>
        
        <transition name="fade">
          <div v-if="!streaming" class="message-actions">
            <el-tooltip content="复制" placement="top" :show-after="500">
              <el-button
                text
                circle
                size="small"
                class="action-btn"
                @click="handleCopy"
              >
                <el-icon><DocumentCopy /></el-icon>
              </el-button>
            </el-tooltip>
            
            <el-tooltip v-if="message.role === 'assistant'" content="重新生成" placement="top" :show-after="500">
              <el-button
                text
                circle
                size="small"
                class="action-btn"
                @click="handleRegenerate"
              >
                <el-icon><RefreshRight /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Document, DocumentCopy, RefreshRight, Service } from '@element-plus/icons-vue'
import type { ChatMessage } from '@/types/chat'
import { formatDate } from '@/utils/format'
import MarkdownRenderer from './MarkdownRenderer.vue'

/**
 * 组件属性
 */
const props = defineProps<{
  message: ChatMessage // 聊天消息对象
  streaming?: boolean // 是否为流式输出
}>()

/**
 * 组件事件
 */
const emit = defineEmits<{
  regenerate: [] // 重新生成事件
}>()

/**
 * 复制消息内容
 */
async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.message.content)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}

/**
 * 重新生成AI回复
 */
function handleRegenerate() {
  emit('regenerate')
}
</script>

<style scoped lang="scss">
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 16px;
  transition: all 0.3s ease;

  // 用户消息样式
  &.role-user {
    flex-direction: row-reverse;
    .message-body { align-items: flex-end; }
    .message-content {
      background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
      color: #fff;
      border-radius: 16px 4px 16px 16px;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      p { color: #fff; }
    }
    .message-footer {
      flex-direction: row-reverse;
    }
  }
  
  // AI 助手消息样式
  &.role-assistant {
    .message-content {
      background: #f4f4f5;
      border-radius: 4px 16px 16px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }
  
  &:hover {
    .message-actions {
      opacity: 1;
    }
  }
}

.message-body {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.message-content {
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  transition: all 0.3s ease;
  p { margin: 0; }
}

.message-documents {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.doc-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);

  .el-icon {
    font-size: 14px;
  }

  span {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.doc-more {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.message-time {
  font-size: 11px;
  color: #c0c4cc;
}

.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.action-btn {
  padding: 4px;
  color: #909399;
  transition: all 0.2s ease;
  
  &:hover {
    color: #409eff;
    background: rgba(64, 158, 255, 0.1);
  }
}

// 光标闪烁动画
.cursor-blink {
  animation: blink 1s step-end infinite;
  font-weight: bold;
  color: #409eff;
}

@keyframes blink {
  50% { opacity: 0; }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
