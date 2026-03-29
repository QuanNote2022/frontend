<template>
  <div class="markdown-body" v-html="renderedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps<{ content: string }>()

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
})

const renderedHtml = computed(() => md.render(props.content || ''))
</script>

<style scoped lang="scss">
.markdown-body {
  font-size: 14px;
  line-height: 1.7;
  color: #303133;

  :deep(h1), :deep(h2), :deep(h3) {
    margin: 12px 0 8px;
    color: #303133;
  }
  :deep(h2) { font-size: 16px; }
  :deep(h3) { font-size: 15px; }
  :deep(p) { margin: 6px 0; }
  :deep(ul), :deep(ol) {
    padding-left: 20px;
    margin: 6px 0;
  }
  :deep(li) { margin: 3px 0; }
  :deep(strong) { color: #303133; }
  :deep(code) {
    background: #f0f0f0;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 13px;
    font-family: 'Courier New', monospace;
  }
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
  :deep(blockquote) {
    border-left: 4px solid #409eff;
    padding: 8px 16px;
    margin: 8px 0;
    background: #ecf5ff;
    color: #606266;
  }
}
</style>
