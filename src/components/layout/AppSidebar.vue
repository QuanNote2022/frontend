<template>
  <el-aside :width="collapsed ? '64px' : '220px'" class="app-sidebar">
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      router
      class="sidebar-menu"
      :collapse-transition="false"
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <template #title>首页</template>
      </el-menu-item>
      <el-menu-item index="/detect">
        <el-icon><Camera /></el-icon>
        <template #title>矿物识别</template>
      </el-menu-item>
      <el-menu-item index="/chat">
        <el-icon><ChatDotRound /></el-icon>
        <template #title>科普问答</template>
      </el-menu-item>
      <el-sub-menu index="history">
        <template #title>
          <el-icon><Clock /></el-icon>
          <span>历史记录</span>
        </template>
        <el-menu-item index="/history/detect">识别历史</el-menu-item>
        <el-menu-item index="/history/chat">问答历史</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/profile">
        <el-icon><User /></el-icon>
        <template #title>个人中心</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{ collapsed: boolean }>()

const route = useRoute()
const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/detect')) return '/detect'
  if (path.startsWith('/chat')) return '/chat'
  if (path.startsWith('/history/detect')) return '/history/detect'
  if (path.startsWith('/history/chat')) return '/history/chat'
  return path
})
</script>

<style scoped lang="scss">
.app-sidebar {
  background: #fff;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s;
}
.sidebar-menu {
  border-right: none;
  height: 100%;
}
</style>
