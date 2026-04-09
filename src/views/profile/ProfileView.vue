<template>
  <div class="profile-page">
    <div class="page-header">
      <div class="header-content">
        <div class="header-badge">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </div>
        <h2 class="page-title">账户管理</h2>
        <p class="page-subtitle">管理您的个人信息、安全设置和偏好</p>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-sidebar">
        <div class="user-card">
          <div class="avatar-section">
            <div class="avatar-wrapper" @click="handleAvatarClick">
              <el-avatar :size="100" :src="userStore.userInfo?.avatar || undefined">
                {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
              </el-avatar>
              <div class="avatar-overlay">
                <el-icon><Camera /></el-icon>
              </div>
            </div>
            <input
              ref="avatarInputRef"
              type="file"
              accept="image/*"
              hidden
              @change="handleAvatarChange"
            />
          </div>
          <h3 class="user-name">{{ userStore.userInfo?.nickname || '用户' }}</h3>
          <p class="user-email">{{ userStore.userInfo?.email }}</p>
          <div class="user-join">
            <el-icon><Calendar /></el-icon>
            <span>{{ formatDate(userStore.userInfo?.createdAt || '') }} 加入</span>
          </div>
        </div>

        <div class="achievements-preview" v-if="achievements.length">
          <h4 class="section-title">
            <el-icon><Trophy /></el-icon>
            成就徽章
          </h4>
          <div class="achievement-icons">
            <div
              v-for="a in unlockedAchievements.slice(0, 4)"
              :key="a.achievementId"
              class="achievement-icon"
              :title="a.name"
            >
              {{ a.icon }}
            </div>
            <div v-if="unlockedAchievements.length > 4" class="achievement-more">
              +{{ unlockedAchievements.length - 4 }}
            </div>
          </div>
        </div>
      </div>

      <div class="profile-main">
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)">
                <el-icon><Camera /></el-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats?.totalDetections || 0 }}</span>
                <span class="stat-label">识别次数</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%)">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats?.totalChats || 0 }}</span>
                <span class="stat-label">问答次数</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)">
                <el-icon><Aim /></el-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats?.mineralTypes || 0 }}</span>
                <span class="stat-label">矿物种类</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <span class="stat-value">{{ stats?.activeDays || 0 }}</span>
                <span class="stat-label">活跃天数</span>
              </div>
            </div>
          </div>
        </div>

        <el-tabs v-model="activeTab" class="main-tabs">
          <el-tab-pane label="基本信息" name="profile">
            <ProfileForm
              :loading="profileLoading"
              @submit="handleUpdateProfile"
            />
          </el-tab-pane>

          <el-tab-pane label="安全设置" name="security">
            <SecuritySection
              :devices="loginDevices"
              :login-history="loginHistory"
              @logout-device="handleLogoutDevice"
            />
          </el-tab-pane>

          <el-tab-pane label="偏好设置" name="preferences">
            <PreferencesSection
              :preferences="preferences"
              :loading="preferencesLoading"
              @update="handleUpdatePreferences"
            />
          </el-tab-pane>

          <el-tab-pane label="成就徽章" name="achievements">
            <AchievementsSection :achievements="achievements" />
          </el-tab-pane>

          <el-tab-pane label="数据管理" name="data">
            <DataSection
              @export="handleExportData"
              @clear-history="handleClearHistory"
              @delete-account="handleDeleteAccount"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getUserStatsApi,
  uploadAvatarApi,
  getLoginDevicesApi,
  logoutDeviceApi,
  getLoginHistoryApi,
  getUserPreferencesApi,
  updateUserPreferencesApi,
  getUserAchievementsApi,
  exportUserDataApi,
  clearHistoryApi,
  deleteAccountApi,
} from '@/api/user'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import SecuritySection from '@/components/profile/SecuritySection.vue'
import PreferencesSection from '@/components/profile/PreferencesSection.vue'
import AchievementsSection from '@/components/profile/AchievementsSection.vue'
import DataSection from '@/components/profile/DataSection.vue'
import type {
  UserStats,
  LoginDevice,
  LoginHistory,
  UserPreferences,
  Achievement,
} from '@/types/user'

const userStore = useUserStore()

const activeTab = ref('profile')
const avatarInputRef = ref<HTMLInputElement>()

const stats = ref<UserStats | null>(null)
const loginDevices = ref<LoginDevice[]>([])
const loginHistory = ref<LoginHistory[]>([])
const preferences = ref<UserPreferences>({
  emailNotification: true,
  systemNotification: true,
  theme: 'light',
  language: 'zh-CN',
})
const achievements = ref<Achievement[]>([])

const profileLoading = ref(false)
const preferencesLoading = ref(false)

const unlockedAchievements = computed(() =>
  achievements.value.filter((a) => a.unlocked)
)

onMounted(async () => {
  await Promise.all([loadStats(), loadDevices(), loadPreferences(), loadAchievements()])
})

async function loadStats() {
  try {
    const res = await getUserStatsApi()
    stats.value = res.data
  } catch {
    console.error('Failed to load stats')
  }
}

async function loadDevices() {
  try {
    const [devicesRes, historyRes] = await Promise.all([
      getLoginDevicesApi(),
      getLoginHistoryApi({ page: 1, pageSize: 10 }),
    ])
    loginDevices.value = devicesRes.data
    loginHistory.value = historyRes.data.list
  } catch {
    console.error('Failed to load devices')
  }
}

async function loadPreferences() {
  try {
    const res = await getUserPreferencesApi()
    preferences.value = res.data
  } catch {
    console.error('Failed to load preferences')
  }
}

async function loadAchievements() {
  try {
    const res = await getUserAchievementsApi()
    achievements.value = res.data
  } catch {
    console.error('Failed to load achievements')
  }
}

function handleAvatarClick() {
  avatarInputRef.value?.click()
}

async function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    const res = await uploadAvatarApi(file)
    await userStore.updateProfile({ avatar: res.data.avatarUrl })
    ElMessage.success('头像更新成功')
  } catch {
    ElMessage.error('头像上传失败')
  }
}

async function handleUpdateProfile(data: { nickname: string; email: string }) {
  profileLoading.value = true
  try {
    await userStore.updateProfile(data)
    ElMessage.success('信息更新成功')
  } catch {
    // 错误由拦截器处理
  } finally {
    profileLoading.value = false
  }
}

async function handleLogoutDevice(deviceId: string) {
  try {
    await ElMessageBox.confirm('确定要强制该设备下线吗？', '确认操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await logoutDeviceApi(deviceId)
    loginDevices.value = loginDevices.value.filter((d) => d.deviceId !== deviceId)
    ElMessage.success('设备已下线')
  } catch {
    // 用户取消
  }
}

async function handleUpdatePreferences(data: Partial<UserPreferences>) {
  preferencesLoading.value = true
  try {
    await updateUserPreferencesApi(data)
    preferences.value = { ...preferences.value, ...data }
    ElMessage.success('设置已保存')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    preferencesLoading.value = false
  }
}

async function handleExportData() {
  try {
    const res = await exportUserDataApi()
    ElMessage.success('数据导出成功，请查看下载链接')
    console.log('Download URL:', res.data.downloadUrl)
  } catch {
    ElMessage.error('导出失败')
  }
}

async function handleClearHistory(type: 'detect' | 'chat' | 'all') {
  try {
    await ElMessageBox.confirm(
      type === 'all' ? '确定要清除所有历史记录吗？此操作不可恢复。' : `确定要清除${type === 'detect' ? '识别' : '问答'}历史记录吗？`,
      '确认清除',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    await clearHistoryApi(type)
    ElMessage.success('历史记录已清除')
  } catch {
    // 用户取消
  }
}

async function handleDeleteAccount() {
  try {
    const { value } = await ElMessageBox.prompt('请输入密码以确认注销账户', '注销账户', {
      confirmButtonText: '注销',
      cancelButtonText: '取消',
      inputType: 'password',
      inputPlaceholder: '请输入密码',
      inputValidator: (val) => !!val || '请输入密码',
    })
    await deleteAccountApi(value)
    ElMessage.success('账户已注销')
    userStore.logout()
  } catch {
    // 用户取消或密码错误
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.profile-page {
  padding: 0;
  background: $bg-primary;
  min-height: calc(100vh - $header-height - $spacing-10);
}

.page-header {
  position: relative;
  padding: $spacing-10 $spacing-8;
  background: $gradient-primary;
  border-radius: $radius-2xl;
  margin-bottom: $spacing-6;
  overflow: hidden;

  .header-content {
    position: relative;
    z-index: 2;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: $spacing-2;
    padding: $spacing-2 $spacing-4;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border-radius: $radius-full;
    margin-bottom: $spacing-4;

    .el-icon { font-size: 14px; }
    span {
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      color: white;
      letter-spacing: $letter-spacing-wide;
    }
  }

  .page-title {
    font-size: $font-size-4xl;
    font-weight: $font-weight-extrabold;
    color: white;
    margin: 0 0 $spacing-2;
    letter-spacing: $letter-spacing-tight;
  }

  .page-subtitle {
    font-size: $font-size-base;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
  }
}

.profile-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: $spacing-6;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: $spacing-5;
}

.user-card {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  padding: $spacing-8 $spacing-5;
  text-align: center;
}

.avatar-section {
  margin-bottom: $spacing-5;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;

  .el-avatar {
    border: 4px solid $bg-card;
    box-shadow: $shadow-lg;
    transition: $transition-slow;
  }

  .avatar-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    opacity: 0;
    transition: $transition-fast;

    .el-icon {
      color: white;
      font-size: 24px;
    }
  }

  &:hover {
    .el-avatar {
      transform: scale(1.05);
    }

    .avatar-overlay {
      opacity: 1;
    }
  }
}

.user-name {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0 0 $spacing-1;
}

.user-email {
  font-size: $font-size-sm;
  color: $gray-500;
  margin: 0 0 $spacing-4;
}

.user-join {
  display: inline-flex;
  align-items: center;
  gap: $spacing-2;
  padding: $spacing-2 $spacing-3;
  background: $gray-50;
  border-radius: $radius-full;
  font-size: $font-size-xs;
  color: $gray-600;

  .el-icon { color: $primary-500; }
}

.achievements-preview {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  padding: $spacing-5;

  .section-title {
    display: flex;
    align-items: center;
    gap: $spacing-2;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-700;
    margin: 0 0 $spacing-4;

    .el-icon { color: $warning-color; }
  }
}

.achievement-icons {
  display: flex;
  gap: $spacing-2;
}

.achievement-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gradient-primary;
  border-radius: $radius-lg;
  font-size: 20px;
}

.achievement-more {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
  border-radius: $radius-lg;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $gray-500;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: $spacing-5;
}

.stats-section {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  padding: $spacing-5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-4;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $radius-lg;
  transition: $transition-fast;

  &:hover {
    background: rgba($primary-500, 0.05);
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  color: white;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
}

.stat-label {
  font-size: $font-size-xs;
  color: $gray-500;
}

.main-tabs {
  background: $bg-card;
  border-radius: $radius-xl;
  border: 1px solid rgba($gray-200, 0.5);
  overflow: hidden;

  :deep(.el-tabs__header) {
    margin: 0;
    padding: 0 $spacing-5;
    background: $gray-50;
    border-bottom: 1px solid $gray-100;
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  :deep(.el-tabs__item) {
    height: 56px;
    line-height: 56px;
    font-weight: $font-weight-medium;

    &.is-active {
      color: $primary-600;
    }
  }

  :deep(.el-tabs__active-bar) {
    background: $gradient-primary;
    height: 3px;
    border-radius: $radius-full;
  }

  :deep(.el-tabs__content) {
    padding: $spacing-6;
  }
}

@media (max-width: $breakpoint-md) {
  .page-header {
    padding: $spacing-6 $spacing-4;

    .page-title {
      font-size: $font-size-2xl;
    }
  }
}
</style>
