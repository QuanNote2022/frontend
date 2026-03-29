<template>
  <el-header class="app-header">
    <div class="header-left">
      <el-icon class="menu-toggle" @click="$emit('toggle-sidebar')"><Fold /></el-icon>
      <div class="logo" @click="router.push('/')">
        <el-icon :size="24" color="#409eff"><Aim /></el-icon>
        <span class="logo-text">矿物识别系统</span>
      </div>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" :src="userStore.userInfo?.avatar || undefined">
            {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
          </el-avatar>
          <span class="username">{{ userStore.userInfo?.nickname || '用户' }}</span>
          <el-icon><ArrowDown /></el-icon>
        </div>
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

defineEmits(['toggle-sidebar'])

const router = useRouter()
const userStore = useUserStore()

function handleCommand(cmd: string) {
  if (cmd === 'profile') {
    router.push('/profile')
  } else if (cmd === 'logout') {
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
