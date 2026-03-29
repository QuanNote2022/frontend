<template>
  <!-- 主布局容器 -->
  <el-container class="main-layout">
    <!-- 应用头部 -->
    <AppHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    <!-- 布局主体部分 -->
    <el-container class="layout-body">
      <!-- 应用侧边栏 -->
      <AppSidebar :collapsed="sidebarCollapsed" />
      <!-- 主内容区域 -->
      <el-main class="layout-main">
        <!-- 路由视图，使用过渡效果 -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import { useUserStore } from '@/stores/user'

// 侧边栏折叠状态
const sidebarCollapsed = ref(false)
// 用户状态管理
const userStore = useUserStore()

/**
 * 组件挂载后执行
 * @description 检查用户登录状态并获取用户信息
 */
onMounted(() => {
  // 如果用户已登录但用户信息不存在，则获取用户信息
  if (userStore.isLoggedIn && !userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh; // 全屏高度
  flex-direction: column; // 垂直布局
}

.layout-body {
  flex: 1; // 占据剩余空间
  overflow: hidden; // 防止溢出
}

.layout-main {
  background: #f5f7fa; // 背景色
  overflow-y: auto; // 垂直滚动
  padding: 20px; // 内边距
}
</style>
