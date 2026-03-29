<template>
  <div class="chat-page">
    <!-- 侧边栏：会话列表 -->
    <div class="chat-sidebar">
      <el-button type="primary" class="new-chat-btn" @click="handleNewChat">
        <el-icon><Plus /></el-icon>新建对话
      </el-button>
      <div class="session-list">
        <div
          v-for="s in chatStore.sessions"
          :key="s.sessionId"
          class="session-item"
          :class="{ active: s.sessionId === chatStore.currentSessionId }"
          @click="handleSwitchSession(s.sessionId)"
        >
          <el-icon><ChatDotRound /></el-icon>
          <span class="session-title">{{ s.title }}</span>
          <el-icon class="session-delete" @click.stop="handleDeleteSession(s.sessionId)"><Delete /></el-icon>
        </div>
        <div v-if="chatStore.sessions.length === 0" class="empty-sessions">
          <p>暂无对话记录</p>
        </div>
      </div>
    </div>

    <!-- 主聊天区域 -->
    <div class="chat-main">
      <!-- 矿物上下文横幅 -->
      <div v-if="chatStore.mineralContext" class="mineral-context-banner">
        <el-icon><Aim /></el-icon>
        <span>当前矿物上下文：<strong>{{ chatStore.mineralContext }}</strong></span>
        <el-button text size="small" @click="chatStore.setMineralContext(null)">清除</el-button>
      </div>

      <!-- 消息列表 -->
      <div ref="messagesRef" class="messages-container">
        <div v-if="chatStore.messages.length === 0 && !chatStore.currentSessionId" class="welcome-state">
          <el-icon :size="64" color="#409eff"><ChatDotRound /></el-icon>
          <h3>矿物科普智能问答</h3>
          <p>您可以向我提问关于矿物的任何问题</p>
          <div class="suggestion-chips">
            <el-button v-for="q in suggestedQuestions" :key="q" size="small" round @click="sendQuickQuestion(q)">{{ q }}</el-button>
          </div>
        </div>
        <ChatMessageComp
          v-for="(msg, idx) in chatStore.messages"
          :key="msg.messageId"
          :message="msg"
          :streaming="chatStore.isGenerating && idx === chatStore.messages.length - 1 && msg.role === 'assistant'"
        />
        <div v-if="chatStore.isGenerating" class="generating-hint">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>AI 正在思考...</span>
          <el-button text size="small" type="danger" @click="chatStore.stopGeneration()">停止生成</el-button>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="2"
          placeholder="请输入问题... (Enter 发送，Shift+Enter 换行)"
          :disabled="chatStore.isGenerating"
          resize="none"
          @keydown="handleKeyDown"
        />
        <el-button
          type="primary"
          :disabled="!inputText.trim() || chatStore.isGenerating"
          @click="handleSend"
        >
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import ChatMessageComp from '@/components/common/ChatMessage.vue'

/**
 * 聊天页面组件
 * 提供矿物科普智能问答功能，支持多会话管理
 */

// 路由和状态管理
const route = useRoute()
const chatStore = useChatStore()

// 输入文本和消息容器引用
const inputText = ref('')
const messagesRef = ref<HTMLDivElement>()

/**
 * 推荐问题列表
 */
const suggestedQuestions = [
  '石英有哪些常见的用途？',
  '如何区分方解石和石英？',
  '什么是莫氏硬度？',
  '黄铁矿为什么叫愚人金？',
]

/**
 * 组件挂载后初始化
 * 1. 加载会话列表
 * 2. 处理矿物上下文参数
 * 3. 处理会话ID参数
 */
onMounted(async () => {
  await chatStore.loadSessions()

  const mineralName = route.query.mineral as string
  if (mineralName) {
    // 设置矿物上下文并创建新会话
    chatStore.setMineralContext(mineralName)
    await chatStore.createSession(mineralName)
    await handleSendMessage(`请详细介绍一下${mineralName}的特性、产地和用途。`)
  } else if (route.params.sessionId) {
    // 切换到指定会话
    await chatStore.switchSession(route.params.sessionId as string)
  }
})

// 监听消息变化，自动滚动到底部
watch(
  () => chatStore.messages.length,
  () => {
    nextTick(() => scrollToBottom())
  }
)

// 监听流式内容变化，自动滚动到底部
watch(
  () => chatStore.streamingContent,
  () => {
    nextTick(() => scrollToBottom())
  }
)

/**
 * 滚动到消息底部
 */
function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

/**
 * 处理键盘事件
 * Enter 发送消息，Shift+Enter 换行
 */
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

/**
 * 处理发送消息
 */
async function handleSend() {
  const text = inputText.value.trim()
  if (!text) return
  inputText.value = ''
  await handleSendMessage(text)
}

/**
 * 发送消息到聊天API
 */
async function handleSendMessage(text: string) {
  if (!chatStore.currentSessionId) {
    // 如果没有当前会话，创建新会话
    await chatStore.createSession(chatStore.mineralContext || undefined)
  }
  await chatStore.sendMessage(text)
}

/**
 * 发送快速问题
 */
async function sendQuickQuestion(q: string) {
  inputText.value = q
  await handleSend()
}

/**
 * 处理新建对话
 */
async function handleNewChat() {
  chatStore.setMineralContext(null)
  await chatStore.createSession()
}

/**
 * 处理切换会话
 */
async function handleSwitchSession(sessionId: string) {
  await chatStore.switchSession(sessionId)
}

/**
 * 处理删除会话
 */
async function handleDeleteSession(sessionId: string) {
  await chatStore.removeSession(sessionId)
}
</script>

<style scoped lang="scss">
.chat-page {
  display: flex;
  height: calc(100vh - 100px);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.chat-sidebar {
  width: 260px;
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.new-chat-btn {
  margin: 16px;
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 2px;
  font-size: 14px;
  color: #606266;

  &:hover {
    background: #ebeef5;
    .session-delete { opacity: 1; }
  }
  &.active {
    background: #ecf5ff;
    color: #409eff;
  }
}

.session-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-delete {
  opacity: 0;
  color: #c0c4cc;
  transition: opacity 0.2s;
  &:hover { color: #f56c6c; }
}

.empty-sessions {
  text-align: center;
  padding: 40px 16px;
  p { color: #c0c4cc; font-size: 13px; }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mineral-context-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #ecf5ff;
  border-bottom: 1px solid #d9ecff;
  font-size: 13px;
  color: #409eff;
  strong { color: #303133; }
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.welcome-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  h3 { margin: 16px 0 8px; color: #303133; font-size: 20px; }
  p { color: #909399; margin-bottom: 24px; }
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  max-width: 500px;
}

.generating-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 28px;
  font-size: 13px;
  color: #909399;
}

.input-area {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #ebeef5;
  background: #fff;
  align-items: flex-end;

  :deep(.el-textarea__inner) {
    border-radius: 8px;
  }
}
</style>
