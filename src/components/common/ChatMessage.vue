<template>
  <div class="chat-message" :class="[`role-${message.role}`]">
    <!-- 消息头像 -->
    <div class="message-avatar">
      <!-- AI 助手头像 -->
      <el-avatar v-if="message.role === 'assistant'" :size="36" style="background: #409eff;">AI</el-avatar>
      <!-- 用户头像 -->
      <el-avatar v-else :size="36" style="background: #67c23a;">
        {{ '我' }}
      </el-avatar>
    </div>
    <!-- 消息内容 -->
    <div class="message-body">
      <div class="message-content">
        <!-- AI 消息使用 Markdown 渲染 -->
        <MarkdownRenderer v-if="message.role === 'assistant'" :content="message.content" />
        <!-- 用户消息直接显示文本 -->
        <p v-else>{{ message.content }}</p>
        <!-- 流式输出时的光标动画 -->
        <span v-if="streaming" class="cursor-blink">|</span>
      </div>
      <!-- 消息时间 -->
      <div class="message-time">{{ formatDate(message.createdAt) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chat'
import { formatDate } from '@/utils/format'
import MarkdownRenderer from './MarkdownRenderer.vue'

/**
 * 组件属性
 */
defineProps<{
  message: ChatMessage // 聊天消息对象
  streaming?: boolean // 是否为流式输出
}>()
</script>

<style scoped lang="scss">
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 16px;

  // 用户消息样式
  &.role-user {
    flex-direction: row-reverse;
    .message-body { align-items: flex-end; }
    .message-content {
      background: #409eff;
      color: #fff;
      border-radius: 12px 2px 12px 12px;
      p { color: #fff; }
    }
    .message-time { text-align: right; }
  }
  
  // AI 助手消息样式
  &.role-assistant {
    .message-content {
      background: #f4f4f5;
      border-radius: 2px 12px 12px 12px;
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
  p { margin: 0; }
}

.message-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
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
</style>
