<template>
  <div class="chat-page">
    <div class="chat-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">对话列表</h3>
        <el-button type="primary" class="new-chat-btn" @click="handleNewChat">
          <el-icon><Plus /></el-icon>
          新建对话
        </el-button>
      </div>
      
      <div v-if="chatStore.isLoadingSessions" class="session-skeleton">
        <div v-for="i in 5" :key="i" class="skeleton-item">
          <el-skeleton :rows="1" animated />
        </div>
      </div>
      
      <transition-group v-else name="session-list" tag="div" class="session-list">
        <div
          v-for="s in chatStore.sessions"
          :key="s.sessionId"
          class="session-item"
          :class="{ active: s.sessionId === chatStore.currentSessionId }"
          @click="handleSwitchSession(s.sessionId)"
        >
          <div class="session-icon">
            <el-icon><ChatDotRound /></el-icon>
          </div>
          <div class="session-content">
            <span class="session-title">{{ s.title }}</span>
            <span class="session-time">{{ formatTime(s.lastActiveAt) }}</span>
          </div>
          <el-popconfirm
            title="确定删除此对话吗？"
            confirm-button-text="删除"
            cancel-button-text="取消"
            @confirm="handleDeleteSession(s.sessionId)"
          >
            <template #reference>
              <button class="session-delete" @click.stop>
                <el-icon><Delete /></el-icon>
              </button>
            </template>
          </el-popconfirm>
        </div>
      </transition-group>
      
      <transition name="fade">
        <div v-if="!chatStore.isLoadingSessions && chatStore.sessions.length === 0" class="empty-sessions">
          <div class="empty-icon">
            <el-icon :size="48"><ChatDotRound /></el-icon>
          </div>
          <p>暂无对话记录</p>
          <span>点击上方按钮开始新对话</span>
        </div>
      </transition>
    </div>

    <div class="chat-main">
      <transition name="slide-down">
        <div v-if="chatStore.mineralContext" class="context-banner">
          <div class="banner-content">
            <el-icon><Aim /></el-icon>
            <span>当前矿物上下文：<strong>{{ chatStore.mineralContext }}</strong></span>
          </div>
          <el-button text size="small" @click="chatStore.setMineralContext(null)">清除</el-button>
        </div>
      </transition>

      <div ref="messagesRef" class="messages-container" @scroll="handleScroll">
        <transition name="fade-scale">
          <div v-if="chatStore.messages.length === 0 && !chatStore.currentSessionId" class="welcome-state">
            <div class="welcome-illustration">
              <div class="illustration-main">
                <el-icon :size="64"><ChatDotRound /></el-icon>
              </div>
              <div class="illustration-rings">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <h3 class="welcome-title">矿物科普智能问答</h3>
            <p class="welcome-desc">您可以向我提问关于矿物的任何问题</p>
            <div class="suggestion-chips">
              <button
                v-for="q in suggestedQuestions"
                :key="q"
                class="suggestion-btn"
                @click="sendQuickQuestion(q)"
              >
                <el-icon><QuestionFilled /></el-icon>
                {{ q }}
              </button>
            </div>
          </div>
        </transition>
        
        <transition-group name="message-list" tag="div" class="messages-list">
          <ChatMessageComp
            v-for="(msg, idx) in chatStore.messages"
            :key="msg.messageId"
            :message="msg"
            :streaming="chatStore.isGenerating && idx === chatStore.messages.length - 1 && msg.role === 'assistant'"
            @regenerate="handleRegenerate"
          />
        </transition-group>
        
        <transition name="fade">
          <div v-if="chatStore.isGenerating" class="generating-hint">
            <div class="generating-animation">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>AI 正在思考...</span>
            </div>
            <el-button text size="small" type="danger" @click="chatStore.stopGeneration()">停止生成</el-button>
          </div>
        </transition>
      </div>
      
      <transition name="fade">
        <div v-if="showScrollButton" class="scroll-buttons">
          <button class="scroll-btn" @click="handleScrollButton">
            <el-icon :size="20">
              <component :is="isAtBottom ? 'Top' : 'Bottom'" />
            </el-icon>
          </button>
        </div>
      </transition>

      <div class="input-area"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        :class="{ 'is-dragging': isDragging }"
      >
        <div class="input-wrapper" :class="{ 'has-documents': chatStore.uploadedDocuments.length > 0 }">
          <transition-group name="doc-tag" tag="div" class="document-tags" v-if="chatStore.uploadedDocuments.length > 0">
            <div class="doc-tag" v-for="doc in chatStore.uploadedDocuments" :key="doc.documentId">
              <el-icon class="doc-icon"><Document /></el-icon>
              <span class="doc-name">{{ doc.fileName }}</span>
              <el-icon class="doc-remove" @click="handleRemoveDoc(doc.documentId)"><Close /></el-icon>
            </div>
          </transition-group>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="chatStore.uploadedDocuments.length > 0 ? 1 : 2"
            :placeholder="chatStore.uploadedDocuments.length > 0 ? '添加消息...' : '请输入问题... (Enter 发送，Shift+Enter 换行)'"
            :disabled="chatStore.isGenerating"
            resize="none"
            class="input-textarea"
            @keydown="handleKeyDown"
          />
          <div class="action-buttons">
            <el-tooltip content="上传文件" placement="top">
              <el-button class="upload-btn" @click="handleFileSelect" :loading="isUploading">
                <el-icon :size="18"><Upload /></el-icon>
              </el-button>
            </el-tooltip>
            <button
              class="send-btn"
              :disabled="(!inputText.trim() && chatStore.uploadedDocuments.length === 0) || chatStore.isGenerating"
              @click="handleSend"
            >
              <el-icon v-if="!chatStore.isGenerating" :size="20"><Promotion /></el-icon>
              <el-icon v-else class="is-loading" :size="20"><Loading /></el-icon>
            </button>
          </div>
        </div>
        <transition name="fade">
          <div v-if="isDragging" class="drag-overlay">
            <el-icon :size="48"><Upload /></el-icon>
            <span>释放文件以上传</span>
          </div>
        </transition>
        <input type="file" ref="fileInputRef" style="display: none" accept=".txt,.md,.doc,.docx,.xls,.xlsx" @change="handleFileChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import ChatMessageComp from '@/components/common/ChatMessage.vue'
import { Aim, ChatDotRound, Close, Delete, Document, Loading, Plus, Promotion, QuestionFilled, Upload } from "@element-plus/icons-vue"

const route = useRoute()
const chatStore = useChatStore()

const inputText = ref('')
const messagesRef = ref<HTMLDivElement>()
const showScrollButton = ref(false)
const isAtBottom = ref(true)
const fileInputRef = ref<HTMLInputElement>()
const isUploading = ref(false)
const isDragging = ref(false)

const suggestedQuestions = [
  '石英有哪些常见的用途？',
  '如何区分方解石和石英？',
  '什么是莫氏硬度？',
  '黄铁矿为什么叫愚人金？',
]

onMounted(async () => {
  await chatStore.loadSessions()

  const mineralName = route.query.mineral as string
  if (mineralName) {
    chatStore.setMineralContext(mineralName)
    await chatStore.createSession(mineralName)
    await handleSendMessage(`请详细介绍一下${mineralName}的特性、产地和用途。`)
  } else if (route.params.sessionId) {
    await chatStore.switchSession(route.params.sessionId as string)
  }
})

watch(() => chatStore.messages.length, () => nextTick(() => scrollToBottom()))
watch(() => chatStore.streamingContent, () => nextTick(() => scrollToBottom()))

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString()
}

function handleScroll() {
  if (!messagesRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = messagesRef.value
  isAtBottom.value = scrollHeight - scrollTop - clientHeight < 100
  showScrollButton.value = scrollHeight > clientHeight + 200
}

function handleScrollButton() {
  if (isAtBottom.value) {
    messagesRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    messagesRef.value?.scrollTo({ top: messagesRef.value.scrollHeight, behavior: 'smooth' })
  }
}

function handleKeyDown(e: KeyboardEvent | Event) {
  const keyEvent = e as KeyboardEvent
  if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

async function handleSend() {
  const text = inputText.value.trim()
  if (!text) return
  inputText.value = ''
  await handleSendMessage(text)
}

async function handleSendMessage(text: string) {
  if (!chatStore.currentSessionId) {
    await chatStore.createSession(chatStore.mineralContext || undefined)
  }
  await chatStore.sendMessage(text)
}

async function sendQuickQuestion(q: string) {
  inputText.value = q
  await handleSend()
}

async function handleNewChat() {
  chatStore.setMineralContext(null)
  await chatStore.createSession()
}

async function handleSwitchSession(sessionId: string) {
  await chatStore.switchSession(sessionId)
}

async function handleDeleteSession(sessionId: string) {
  await chatStore.removeSession(sessionId)
}

async function handleRegenerate() {
  await chatStore.regenerate()
}

function handleFileSelect() {
  fileInputRef.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!chatStore.currentSessionId) {
    await chatStore.createSession(chatStore.mineralContext || undefined)
  }

  isUploading.value = true
  try {
    await chatStore.uploadDocument(file)
  } finally {
    isUploading.value = false
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

async function handleRemoveDoc(docId: string) {
  await chatStore.removeDocument(docId)
}

function handleDragOver() {
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

async function handleDrop(event: DragEvent) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return

  if (!chatStore.currentSessionId) {
    await chatStore.createSession(chatStore.mineralContext || undefined)
  }

  isUploading.value = true
  try {
    for (const file of Array.from(files)) {
      await chatStore.uploadDocument(file)
    }
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.chat-page {
  display: flex;
  height: calc(100vh - $header-height - $spacing-10);
  background: $bg-primary;
  border-radius: $radius-2xl;
  overflow: hidden;
}

.chat-sidebar {
  width: 300px;
  background: $bg-card;
  border-right: 1px solid rgba($gray-200, 0.5);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: $spacing-5;
  border-bottom: 1px solid $gray-100;
}

.sidebar-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $gray-500;
  text-transform: uppercase;
  letter-spacing: $letter-spacing-wider;
  margin: 0 0 $spacing-4;
}

.new-chat-btn {
  width: 100%;
  height: 44px;
  background: $gradient-primary;
  border: none;
  border-radius: $radius-lg;
  font-weight: $font-weight-semibold;
  transition: $transition-slow;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-primary;
  }
}

.session-skeleton {
  padding: $spacing-4;
  
  .skeleton-item {
    padding: $spacing-4;
    margin-bottom: $spacing-2;
    background: $gray-50;
    border-radius: $radius-lg;
  }
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-3;
  @include custom-scrollbar(4px);
}

.session-item {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  padding: $spacing-3 $spacing-4;
  border-radius: $radius-lg;
  cursor: pointer;
  margin-bottom: $spacing-1;
  transition: $transition-fast;
  
  &:hover {
    background: $gray-50;
    
    .session-delete { opacity: 1; }
  }
  
  &.active {
    background: rgba($primary-500, 0.08);
    
    .session-icon {
      background: $gradient-primary;
      color: white;
    }
    
    .session-title { color: $primary-600; font-weight: $font-weight-semibold; }
  }
}

.session-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
  border-radius: $radius-md;
  color: $gray-500;
  flex-shrink: 0;
}

.session-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.session-title {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-time {
  font-size: $font-size-xs;
  color: $gray-400;
  margin-top: 2px;
}

.session-delete {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: $radius-md;
  color: $gray-400;
  cursor: pointer;
  opacity: 0;
  transition: $transition-fast;
  
  &:hover {
    background: rgba($danger-color, 0.1);
    color: $danger-color;
  }
}

.empty-sessions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-12 $spacing-6;
  text-align: center;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gray-50;
    border-radius: 50%;
    color: $gray-300;
    margin-bottom: $spacing-4;
  }
  
  p {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-600;
    margin: 0 0 $spacing-1;
  }
  
  span {
    font-size: $font-size-xs;
    color: $gray-400;
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: $bg-card;
}

.context-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-3 $spacing-6;
  background: $gradient-primary;
  color: white;
  font-size: $font-size-sm;
  
  .banner-content {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    
    strong { font-weight: $font-weight-semibold; }
  }
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-6;
  @include custom-scrollbar();
}

.welcome-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: $spacing-8;
}

.welcome-illustration {
  position: relative;
  margin-bottom: $spacing-8;
  
  .illustration-main {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gradient-primary;
    border-radius: $radius-2xl;
    color: white;
    box-shadow: $shadow-primary;
    @include float-animation(10px, 3s);
  }
  
  .illustration-rings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    span {
      position: absolute;
      border: 2px solid rgba($primary-500, 0.2);
      border-radius: 50%;
      animation: ring-expand 3s ease-out infinite;
      
      &:nth-child(1) { animation-delay: 0s; }
      &:nth-child(2) { animation-delay: 1s; }
      &:nth-child(3) { animation-delay: 2s; }
    }
  }
}

@keyframes ring-expand {
  0% { width: 100px; height: 100px; opacity: 1; }
  100% { width: 200px; height: 200px; opacity: 0; }
}

.welcome-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  @include gradient-text();
  margin: 0 0 $spacing-2;
}

.welcome-desc {
  font-size: $font-size-base;
  color: $gray-500;
  margin: 0 0 $spacing-8;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-3;
  justify-content: center;
  max-width: 600px;
}

.suggestion-btn {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-3 $spacing-4;
  background: $bg-card;
  border: 2px solid $gray-200;
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  color: $gray-600;
  cursor: pointer;
  transition: $transition-fast;
  
  &:hover {
    border-color: $primary-500;
    color: $primary-600;
    background: rgba($primary-500, 0.05);
    transform: translateY(-2px);
  }
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.generating-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-4 $spacing-6;
  margin-top: $spacing-4;
  background: $gray-50;
  border-radius: $radius-lg;
}

.generating-animation {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  font-size: $font-size-sm;
  color: $gray-600;
}

.typing-dots {
  display: flex;
  gap: 4px;
  
  span {
    width: 6px;
    height: 6px;
    background: $primary-500;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

.scroll-buttons {
  position: absolute;
  right: $spacing-8;
  bottom: 100px;
  z-index: 10;
}

.scroll-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-card;
  border: 1px solid $gray-200;
  border-radius: 50%;
  color: $gray-600;
  cursor: pointer;
  box-shadow: $shadow-md;
  transition: $transition-fast;
  
  &:hover {
    background: $gradient-primary;
    border-color: transparent;
    color: white;
    transform: scale(1.1);
  }
}

.input-area {
  padding: $spacing-4 $spacing-6 $spacing-6;
  border-top: 1px solid $gray-100;
  background: $bg-card;
  position: relative;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  background: $gray-50;
  border: 2px solid $gray-200;
  border-radius: $radius-xl;
  padding: $spacing-3;
  transition: $transition-fast;

  &:focus-within {
    border-color: $primary-500;
    box-shadow: 0 0 0 4px rgba($primary-500, 0.1);
  }

  &.has-documents {
    background: $bg-card;
  }
}

.document-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-2;
  margin-bottom: $spacing-1;
}

.doc-tag {
  display: inline-flex;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-2 $spacing-3;
  background: rgba($primary-500, 0.08);
  border: 1px solid rgba($primary-500, 0.2);
  border-radius: $radius-lg;
  font-size: $font-size-xs;
  color: $primary-600;
  transition: $transition-fast;

  .doc-icon {
    color: $primary-500;
  }

  .doc-name {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .doc-remove {
    cursor: pointer;
    color: $gray-400;
    transition: $transition-fast;
    margin-left: $spacing-1;

    &:hover {
      color: $danger-color;
    }
  }
}

.doc-tag-enter-active,
.doc-tag-leave-active {
  transition: all 0.2s ease;
}

.doc-tag-enter-from,
.doc-tag-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.drag-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-4;
  background: rgba($primary-500, 0.95);
  color: white;
  border-radius: $radius-xl;
  z-index: 10;
  font-size: $font-size-lg;
  font-weight: $font-weight-medium;
}

.is-dragging {
  .input-wrapper {
    border-color: $primary-500;
    background: rgba($primary-500, 0.05);
  }
}

.action-buttons {
  display: flex;
  gap: $spacing-2;
  align-items: center;
  justify-content: flex-end;
  margin-top: $spacing-2;
}

.upload-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: $radius-lg;
  color: $gray-500;
  cursor: pointer;
  transition: $transition-fast;

  &:hover:not(:disabled) {
    background: $gray-200;
    color: $gray-800;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.input-textarea {
  flex: 1;

  :deep(.el-textarea__inner) {
    border-radius: $radius-lg;
    border: none;
    background: transparent;
    font-size: $font-size-sm;
    padding: $spacing-2;
    resize: none;
    box-shadow: none;

    &::placeholder {
      color: $gray-400;
    }

    &:focus {
      box-shadow: none;
    }
  }
}

.send-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-primary;
  border: none;
  border-radius: $radius-lg;
  color: white;
  cursor: pointer;
  transition: $transition-slow;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: $shadow-primary;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.session-list-enter-active,
.session-list-leave-active {
  transition: all 0.3s $ease-out;
}

.session-list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.session-list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.message-list-enter-active {
  transition: all 0.3s $ease-out;
}

.message-list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: $breakpoint-md) {
  .chat-sidebar {
    display: none;
  }
  
  .welcome-state {
    padding: $spacing-4;
  }
  
  .suggestion-chips {
    flex-direction: column;
  }
  
  .suggestion-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
