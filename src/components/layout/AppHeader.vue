<template>
  <el-header class="app-header">
    <div class="header-inner">
      <div class="header-left">
        <button class="menu-toggle" @click="$emit('toggle-sidebar')">
          <el-icon :size="20"><Fold /></el-icon>
        </button>
        
        <div class="breadcrumb" v-if="currentRoute.meta?.title">
          <el-icon class="breadcrumb-icon"><Location /></el-icon>
          <span class="breadcrumb-text">{{ currentRoute.meta.title }}</span>
        </div>
      </div>
      
      <div class="header-center">
        <div class="search-box">
          <el-icon class="search-icon"><Search /></el-icon>
          <input 
            type="text" 
            placeholder="搜索矿物、问答..." 
            class="search-input"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
          <span class="search-shortcut">⌘K</span>
        </div>
      </div>
      
      <div class="header-right">
        <div class="header-actions">
          <el-tooltip content="通知" placement="bottom">
            <button class="action-btn">
              <el-badge :value="3" :max="99" class="notification-badge">
                <el-icon :size="20"><Bell /></el-icon>
              </el-badge>
            </button>
          </el-tooltip>
          
          <el-tooltip content="帮助" placement="bottom">
            <button class="action-btn">
              <el-icon :size="20"><QuestionFilled /></el-icon>
            </button>
          </el-tooltip>
        </div>
        
        <div class="header-divider"></div>
        
        <el-dropdown trigger="click" @command="handleCommand" class="user-dropdown">
          <div class="user-info">
            <div class="user-avatar">
              <el-avatar :size="36" :src="userStore.userInfo?.avatar || undefined">
                {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="avatar-status"></span>
            </div>
            <div class="user-details">
              <span class="user-name">{{ userStore.userInfo?.nickname || '用户' }}</span>
              <span class="user-role">探索者</span>
            </div>
            <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-menu">
              <div class="menu-header">
                <div class="menu-avatar">
                  <el-avatar :size="48" :src="userStore.userInfo?.avatar || undefined">
                    {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
                  </el-avatar>
                </div>
                <div class="menu-user-info">
                  <span class="menu-user-name">{{ userStore.userInfo?.nickname || '用户' }}</span>
                  <span class="menu-user-email">{{ userStore.userInfo?.email }}</span>
                </div>
              </div>
              <el-dropdown-item divided command="profile">
                <el-icon><User /></el-icon>
                <span>个人中心</span>
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                <span>系统设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout" class="logout-item">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const searchQuery = ref('')

const currentRoute = computed(() => route)

function handleSearch() {
  if (searchQuery.value.trim()) {
    console.log('Search:', searchQuery.value)
  }
}

function handleCommand(cmd: string) {
  if (cmd === 'profile') {
    router.push('/profile')
  } else if (cmd === 'settings') {
    router.push('/settings')
  } else if (cmd === 'logout') {
    userStore.logout()
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.app-header {
  height: $header-height;
  background: $bg-card;
  border-bottom: 1px solid rgba($gray-200, 0.5);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  box-shadow: $shadow-xs;
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-6;
  max-width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

.menu-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: $radius-lg;
  cursor: pointer;
  color: $gray-600;
  transition: $transition-fast;
  
  &:hover {
    background: rgba($primary-500, 0.08);
    color: $primary-500;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-2 $spacing-3;
  background: rgba($gray-100, 0.5);
  border-radius: $radius-lg;
  
  .breadcrumb-icon {
    color: $primary-500;
    font-size: 16px;
  }
  
  .breadcrumb-text {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-700;
  }
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 $spacing-8;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 480px;
  
  .search-icon {
    position: absolute;
    left: $spacing-4;
    top: 50%;
    transform: translateY(-50%);
    color: $gray-400;
    font-size: 18px;
    pointer-events: none;
  }
  
  .search-input {
    width: 100%;
    height: 44px;
    padding: 0 $spacing-12 0 $spacing-12;
    font-size: $font-size-sm;
    border: 2px solid $gray-200;
    border-radius: $radius-xl;
    background: $gray-50;
    transition: $transition-fast;
    
    &:hover {
      border-color: $gray-300;
      background: $bg-card;
    }
    
    &:focus {
      outline: none;
      border-color: $primary-500;
      background: $bg-card;
      box-shadow: 0 0 0 4px rgba($primary-500, 0.1);
    }
    
    &::placeholder {
      color: $gray-400;
    }
  }
  
  .search-shortcut {
    position: absolute;
    right: $spacing-3;
    top: 50%;
    transform: translateY(-50%);
    padding: $spacing-1 $spacing-2;
    font-size: 11px;
    font-weight: $font-weight-medium;
    color: $gray-400;
    background: $gray-100;
    border-radius: $radius-sm;
    pointer-events: none;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: $spacing-2;
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: $radius-lg;
  cursor: pointer;
  color: $gray-500;
  transition: $transition-fast;
  
  &:hover {
    background: rgba($primary-500, 0.08);
    color: $primary-500;
  }
  
  .notification-badge {
    :deep(.el-badge__content) {
      background: $gradient-primary;
      border: none;
    }
  }
}

.header-divider {
  width: 1px;
  height: 32px;
  background: $gray-200;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  padding: $spacing-2 $spacing-3;
  border-radius: $radius-xl;
  transition: $transition-fast;
  
  &:hover {
    background: rgba($gray-100, 0.8);
  }
}

.user-avatar {
  position: relative;
  
  .el-avatar {
    border: 2px solid $gray-100;
    box-shadow: $shadow-sm;
  }
  
  .avatar-status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background: $success-color;
    border: 2px solid $bg-card;
    border-radius: 50%;
  }
}

.user-details {
  display: flex;
  flex-direction: column;
  
  .user-name {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-800;
    line-height: 1.2;
  }
  
  .user-role {
    font-size: $font-size-xs;
    color: $gray-500;
    line-height: 1.2;
  }
}

.dropdown-arrow {
  color: $gray-400;
  font-size: 14px;
  transition: $transition-fast;
}

.user-info:hover .dropdown-arrow {
  color: $gray-600;
}

.user-menu {
  padding: $spacing-2;
  min-width: 240px;
  border-radius: $radius-xl !important;
  border: 1px solid rgba($gray-200, 0.5) !important;
  box-shadow: $shadow-xl !important;
  
  .menu-header {
    display: flex;
    align-items: center;
    gap: $spacing-3;
    padding: $spacing-4;
    margin-bottom: $spacing-2;
    background: linear-gradient(135deg, rgba($primary-500, 0.05) 0%, rgba($secondary-500, 0.05) 100%);
    border-radius: $radius-lg;
    
    .menu-avatar {
      .el-avatar {
        border: 3px solid $bg-card;
        box-shadow: $shadow-md;
      }
    }
    
    .menu-user-info {
      display: flex;
      flex-direction: column;
      
      .menu-user-name {
        font-size: $font-size-base;
        font-weight: $font-weight-semibold;
        color: $gray-800;
      }
      
      .menu-user-email {
        font-size: $font-size-xs;
        color: $gray-500;
      }
    }
  }
  
  :deep(.el-dropdown-menu__item) {
    display: flex;
    align-items: center;
    gap: $spacing-3;
    padding: $spacing-3 $spacing-4;
    border-radius: $radius-lg;
    font-size: $font-size-sm;
    transition: $transition-fast;
    
    .el-icon {
      font-size: 18px;
      color: $gray-500;
    }
    
    &:hover {
      background: rgba($primary-500, 0.05);
      color: $primary-600;
      
      .el-icon {
        color: $primary-500;
      }
    }
  }
  
  .logout-item {
    &:hover {
      background: rgba($danger-color, 0.05) !important;
      color: $danger-color !important;
      
      .el-icon {
        color: $danger-color !important;
      }
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .header-center {
    display: none;
  }
  
  .user-details {
    display: none;
  }
}

@media (max-width: $breakpoint-md) {
  .header-inner {
    padding: 0 $spacing-4;
  }
  
  .breadcrumb {
    display: none;
  }
  
  .header-actions {
    gap: $spacing-1;
  }
  
  .action-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
