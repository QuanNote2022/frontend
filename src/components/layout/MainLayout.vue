<template>
  <el-container class="main-layout">
    <AppHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
    <el-container class="layout-body">
      <AppSidebar :collapsed="sidebarCollapsed" />
      <el-main class="layout-main">
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

const sidebarCollapsed = ref(false)
const userStore = useUserStore()

onMounted(() => {
  if (userStore.isLoggedIn && !userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
  flex-direction: column;
}
.layout-body {
  flex: 1;
  overflow: hidden;
}
.layout-main {
  background: #f5f7fa;
  overflow-y: auto;
  padding: 20px;
}
</style>
