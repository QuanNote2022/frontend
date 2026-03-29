<template>
  <!-- 渲染 Markdown 内容的容器 -->
  <div class="markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

/**
 * 组件属性
 */
const props = defineProps<{
  content: string // Markdown 内容
}>()

/**
 * Markdown 渲染实例
 * @description 配置 Markdown 解析器，禁用 HTML 渲染，启用自动换行和链接自动识别
 */
const md = new MarkdownIt({
  html: false, // 禁用 HTML 渲染，防止 XSS 攻击
  breaks: true, // 启用自动换行
  linkify: true, // 启用链接自动识别
})

/**
 * 渲染后的 HTML 内容
 * @description 将 Markdown 内容转换为 HTML
 */
const renderedHtml = computed(() => md.render(props.content || ''))
</script>

<style scoped lang="scss">
.markdown-body {
  font-size: 14px;
  line-height: 1.7;
  color: #303133;

  // 标题样式
  :deep(h1), :deep(h2), :deep(h3) {
    margin: 12px 0 8px;
    color: #303133;
  }
  :deep(h2) { font-size: 16px; }
  :deep(h3) { font-size: 15px; }
  
  // 段落样式
  :deep(p) { margin: 6px 0; }
  
  // 列表样式
  :deep(ul), :deep(ol) {
    padding-left: 20px;
    margin: 6px 0;
  }
  :deep(li) { margin: 3px 0; }
  
  // 强调样式
  :deep(strong) { color: #303133; }
  
  // 行内代码样式
  :deep(code) {
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
    font-family: 'Courier New', monospace;
  }
  
  // 代码块样式
  :deep(pre) {
    background: #2d2d2d;
    color: #ccc;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 8px 0;
    code {
      background: none;
      padding: 0;
      color: inherit;
    }
  }
  
  // 表格样式
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 8px 0;
    th, td {
      border: 1px solid #dcdfe6;
      padding: 8px 12px;
      text-align: left;
    }
    th { background: #f5f7fa; font-weight: 600; }
  }
  
  // 引用样式
  :deep(blockquote) {
    border-left: 4px solid #409eff;
    padding: 8px 16px;
    margin: 8px 0;
    background: #ecf5ff;
    color: #606266;
  }
}
</style>
