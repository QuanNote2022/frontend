<template>
  <el-aside :width="collapsed ? '72px' : '260px'" class="app-sidebar">
    <div class="sidebar-inner">
      <div class="sidebar-brand" v-if="!collapsed">
        <div class="brand-icon">
          <el-icon :size="28"><Aim /></el-icon>
        </div>
        <div class="brand-text">
          <span class="brand-name">Mineral</span>
          <span class="brand-tagline">智能识别系统</span>
        </div>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        router
        class="sidebar-menu"
        :collapse-transition="false"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>
            <span class="menu-title">首页</span>
          </template>
        </el-menu-item>
        
        <el-menu-item index="/detect">
          <el-icon><Camera /></el-icon>
          <template #title>
            <span class="menu-title">矿物识别</span>
            <span class="menu-badge">AI</span>
          </template>
        </el-menu-item>
        
        <el-menu-item index="/chat">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>
            <span class="menu-title">科普问答</span>
            <span class="menu-badge">AI</span>
          </template>
        </el-menu-item>
        
        <el-sub-menu index="history" class="submenu-wrapper">
          <template #title>
            <el-icon><Clock /></el-icon>
            <span class="menu-title">历史记录</span>
          </template>
          <el-menu-item index="/history/detect">
            <el-icon><PictureFilled /></el-icon>
            <span>识别历史</span>
          </el-menu-item>
          <el-menu-item index="/history/chat">
            <el-icon><ChatLineSquare /></el-icon>
            <span>问答历史</span>
          </el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <template #title>
            <span class="menu-title">个人中心</span>
          </template>
        </el-menu-item>
      </el-menu>
      
      <div class="sidebar-footer" v-if="!collapsed">
        <div class="footer-decoration"></div>
        <div class="footer-content">
          <div class="footer-icon">
            <el-icon :size="20"><Opportunity /></el-icon>
          </div>
          <div class="footer-text">
            <span class="footer-title">探索更多</span>
            <span class="footer-desc">发现矿物世界的奥秘</span>
          </div>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  collapsed: boolean
}>()

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
@use '@/assets/styles/variables' as *;

.app-sidebar {
  background: $bg-card;
  border-right: 1px solid rgba($gray-200, 0.5);
  overflow: hidden;
  transition: width $duration-300 $ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba($primary-500, 0.1) 50%,
      transparent 100%
    );
  }
}

.sidebar-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  @include custom-scrollbar(4px, $gray-300);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  padding: $spacing-6 $spacing-5;
  margin-bottom: $spacing-2;
  
  .brand-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gradient-primary;
    border-radius: $radius-xl;
    color: white;
    box-shadow: $shadow-primary;
    transition: $transition-slow;
    
    &:hover {
      transform: scale(1.05) rotate(5deg);
    }
  }
  
  .brand-text {
    display: flex;
    flex-direction: column;
    
    .brand-name {
      font-family: $font-display;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      @include gradient-text();
      letter-spacing: $letter-spacing-tight;
    }
    
    .brand-tagline {
      font-size: $font-size-xs;
      color: $gray-500;
      letter-spacing: $letter-spacing-wide;
    }
  }
}

.sidebar-menu {
  flex: 1;
  border-right: none !important;
  padding: $spacing-2;
  background: transparent !important;
  
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 48px;
    line-height: 48px;
    margin: 4px 0;
    border-radius: $radius-lg;
    transition: $transition-fast;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: $gradient-primary;
      border-radius: 0 $radius-sm $radius-sm 0;
      transition: height $duration-200 $ease-out;
    }
    
    &:hover {
      background: rgba($primary-500, 0.05) !important;
      
      &::before {
        height: 24px;
      }
      
      .el-icon {
        transform: scale(1.1);
      }
    }
    
    .el-icon {
      font-size: 20px;
      transition: $transition-fast;
    }
  }
  
  :deep(.el-menu-item.is-active) {
    background: $gradient-primary !important;
    color: white !important;
    box-shadow: $shadow-primary;
    
    &::before {
      display: none;
    }
    
    .el-icon {
      color: white !important;
    }
    
    .menu-badge {
      background: rgba(255, 255, 255, 0.25);
      color: white;
    }
  }
  
  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: $primary-600 !important;
    
    .el-icon {
      color: $primary-500 !important;
    }
  }
  
  :deep(.el-sub-menu .el-menu) {
    background: transparent !important;
    padding-left: $spacing-4;
    
    .el-menu-item {
      height: 40px;
      line-height: 40px;
      font-size: $font-size-sm;
      
      &::before {
        left: -$spacing-4;
      }
    }
  }
}

:deep(.menu-title) {
  font-weight: $font-weight-medium;
  letter-spacing: $letter-spacing-tight;
}

:deep(.menu-badge) {
  margin-left: auto;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: $font-weight-bold;
  background: rgba($primary-500, 0.1);
  color: $primary-600;
  border-radius: $radius-full;
  letter-spacing: $letter-spacing-wider;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 18px;
}

.sidebar-footer {
  margin: $spacing-4;
  padding: $spacing-4;
  background: linear-gradient(135deg, rgba($primary-500, 0.05) 0%, rgba($secondary-500, 0.05) 100%);
  border-radius: $radius-xl;
  border: 1px solid rgba($primary-500, 0.1);
  position: relative;
  overflow: hidden;
  
  .footer-decoration {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    background: $gradient-primary;
    opacity: 0.1;
    border-radius: 50%;
    filter: blur(20px);
  }
  
  .footer-content {
    display: flex;
    align-items: center;
    gap: $spacing-3;
    position: relative;
    z-index: 1;
  }
  
  .footer-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gradient-primary;
    border-radius: $radius-lg;
    color: white;
    box-shadow: $shadow-sm;
  }
  
  .footer-text {
    display: flex;
    flex-direction: column;
    
    .footer-title {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $gray-800;
    }
    
    .footer-desc {
      font-size: $font-size-xs;
      color: $gray-500;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .sidebar-brand {
    padding: $spacing-4 $spacing-3;
    
    .brand-text {
      .brand-name {
        font-size: $font-size-base;
      }
    }
  }
  
  .sidebar-footer {
    display: none;
  }
}
</style>
