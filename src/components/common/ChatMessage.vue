<template>
  <div class="chat-message" :class="[`role-${message.role}`]">
    <div class="message-avatar">
      <el-avatar v-if="message.role === 'assistant'" :size="36" style="background: #409eff;">AI</el-avatar>
      <el-avatar v-else :size="36" style="background: #67c23a;">
        {{ '我' }}
      </el-avatar>
    </div>
    <div class="message-body">
      <div class="message-content">
        <MarkdownRenderer v-if="message.role === 'assistant'" :content="message.content" />
        <p v-else>{{ message.content }}</p>
        <span v-if="streaming" class="cursor-blink">|</span>
      </div>
      <div class="message-time">{{ formatDate(message.createdAt) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chat'
import { formatDate } from '@/utils/format'
import MarkdownRenderer from './MarkdownRenderer.vue'

defineProps<{
  message: ChatMessage
  streaming?: boolean
}>()
</script>

<style scoped lang="scss">
.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 16px;

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
.cursor-blink {
  animation: blink 1s step-end infinite;
  font-weight: bold;
  color: #409eff;
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>
