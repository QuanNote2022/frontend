<template>
  <el-header class="app-header">
    <!-- 头部左侧：侧边栏切换按钮和logo -->
    <div class="header-left">
      <!-- 侧边栏切换按钮 -->
      <el-icon class="menu-toggle" @click="$emit('toggle-sidebar')"><Fold /></el-icon>
      <!-- 系统 logo -->
      <div class="logo" @click="router.push('/')">
        <el-icon :size="24" color="#409eff"><Aim /></el-icon>
        <span class="logo-text">矿物识别系统</span>
      </div>
    </div>
    <!-- 头部右侧：用户信息下拉菜单 -->
    <div class="header-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <!-- 用户头像 -->
          <el-avatar :size="32" :src="userStore.userInfo?.avatar || undefined">
            {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <!-- 用户名 -->
          <span class="username">{{ userStore.userInfo?.nickname || '用户' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <!-- 下拉菜单 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

/**
 * 组件事件
 */
defineEmits(['toggle-sidebar']) // 切换侧边栏事件

// 路由实例
const router = useRouter()
// 用户状态管理
const userStore = useUserStore()

/**
 * 处理下拉菜单命令
 * @param cmd - 命令类型
 * @description 根据命令类型执行相应操作
 */
function handleCommand(cmd: string) {
  if (cmd === 'profile') {
    // 跳转到个人中心
    router.push('/profile')
  } else if (cmd === 'logout') {
    // 退出登录
    userStore.logout()
  }
}
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  &:hover { color: #409eff; }
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  &:hover { background: #f5f7fa; }
}

.username {
  font-size: 14px;
  color: #606266;
}
</style>
