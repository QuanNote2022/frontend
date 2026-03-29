<template>
  <!-- 侧边栏容器，根据collapsed属性调整宽度 -->
  <el-aside :width="collapsed ? '64px' : '220px'" class="app-sidebar">
    <!-- 侧边栏菜单 -->
    <el-menu
      :default-active="activeMenu" <!-- 当前激活的菜单项 -->
      :collapse="collapsed" <!-- 是否折叠菜单 -->
      router <!-- 启用路由模式 -->
      class="sidebar-menu"
      :collapse-transition="false" <!-- 禁用折叠动画 -->
    >
      <!-- 首页菜单项 -->
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <template #title>首页</template>
      </el-menu-item>
      <!-- 矿物识别菜单项 -->
      <el-menu-item index="/detect">
        <el-icon><Camera /></el-icon>
        <template #title>矿物识别</template>
      </el-menu-item>
      <!-- 科普问答菜单项 -->
      <el-menu-item index="/chat">
        <el-icon><ChatDotRound /></el-icon>
        <template #title>科普问答</template>
      </el-menu-item>
      <!-- 历史记录子菜单 -->
      <el-sub-menu index="history">
        <template #title>
          <el-icon><Clock /></el-icon>
          <span>历史记录</span>
        </template>
        <el-menu-item index="/history/detect">识别历史</el-menu-item>
        <el-menu-item index="/history/chat">问答历史</el-menu-item>
      </el-sub-menu>
      <!-- 个人中心菜单项 -->
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

/**
 * 组件属性
 */
defineProps<{
  collapsed: boolean // 侧边栏是否折叠
}>()

// 路由实例
const route = useRoute()

/**
 * 当前激活的菜单项
 * @description 根据当前路由路径计算激活的菜单项
 */
const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/detect')) return '/detect' // 矿物识别相关路径
  if (path.startsWith('/chat')) return '/chat' // 科普问答相关路径
  if (path.startsWith('/history/detect')) return '/history/detect' // 识别历史路径
  if (path.startsWith('/history/chat')) return '/history/chat' // 问答历史路径
  return path // 其他路径直接返回
})
</script>

<style scoped lang="scss">
.app-sidebar {
  background: #fff;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s; // 宽度变化过渡效果
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}
</style>
