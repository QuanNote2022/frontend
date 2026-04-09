<template>
  <div class="security-section">
    <div class="section-block">
      <h4 class="block-title">
        <el-icon><Monitor /></el-icon>
        登录设备管理
      </h4>
      <p class="block-desc">管理您的登录设备，发现可疑设备请及时下线</p>

      <div class="device-list">
        <div v-for="device in devices" :key="device.deviceId" class="device-item">
          <div class="device-icon">
            <el-icon :size="24">
              <component :is="getDeviceIcon(device.deviceType)" />
            </el-icon>
          </div>
          <div class="device-info">
            <div class="device-name">
              {{ device.deviceName }}
              <el-tag v-if="device.isCurrent" size="small" type="success">当前设备</el-tag>
            </div>
            <div class="device-meta">
              {{ device.os }} · {{ device.browser }} · {{ device.ipAddress }}
            </div>
            <div class="device-time">
              登录时间: {{ device.loginTime }}
            </div>
          </div>
          <el-button
            v-if="!device.isCurrent"
            text
            type="danger"
            @click="$emit('logout-device', device.deviceId)"
          >
            强制下线
          </el-button>
        </div>
      </div>
    </div>

    <div class="section-block">
      <h4 class="block-title">
        <el-icon><Clock /></el-icon>
        登录历史
      </h4>
      <p class="block-desc">查看最近的登录记录</p>

      <div class="history-list">
        <div v-for="item in loginHistory" :key="item.historyId" class="history-item">
          <div class="history-status" :class="item.status">
            <el-icon :size="16">
              <component :is="item.status === 'success' ? 'CircleCheck' : 'CircleClose'" />
            </el-icon>
          </div>
          <div class="history-info">
            <div class="history-main">
              {{ item.deviceName }} · {{ item.ipAddress }}
            </div>
            <div class="history-meta">
              {{ item.location }} · {{ item.loginTime }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-block">
      <h4 class="block-title">
        <el-icon><Lock /></el-icon>
        修改密码
      </h4>
      <p class="block-desc">定期修改密码可以提高账户安全性</p>

      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px" class="pwd-form">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password class="form-input" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" show-password class="form-input" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="pwdForm.confirmPassword" type="password" show-password class="form-input" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="pwdLoading" class="submit-btn" @click="handleUpdatePassword">
            <el-icon><Lock /></el-icon>
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { updatePasswordApi } from '@/api/user'
import type { LoginDevice, LoginHistory } from '@/types/user'
import type { FormInstance, FormRules } from 'element-plus'

defineProps<{
  devices: LoginDevice[]
  loginHistory: LoginHistory[]
}>()

defineEmits<{ (e: 'logout-device', deviceId: string): void }>()

const pwdFormRef = ref<FormInstance>()
const pwdLoading = ref(false)
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

const pwdRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== pwdForm.newPassword) callback(new Error('两次密码不一致'))
        else callback()
      },
      trigger: 'blur',
    },
  ],
}

function getDeviceIcon(type: string) {
  const icons: Record<string, string> = { desktop: 'Monitor', mobile: 'Iphone', tablet: 'Grid' }
  return icons[type] || 'Monitor'
}

async function handleUpdatePassword() {
  const valid = await pwdFormRef.value?.validate().catch(() => false)
  if (!valid) return

  pwdLoading.value = true
  try {
    await updatePasswordApi({ oldPassword: pwdForm.oldPassword, newPassword: pwdForm.newPassword })
    ElMessage.success('密码修改成功')
    pwdForm.oldPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
  } catch {
    // 错误由拦截器处理
  } finally {
    pwdLoading.value = false
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.security-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-6;
}

.section-block {
  padding-bottom: $spacing-6;
  border-bottom: 1px solid $gray-100;

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.block-title {
  display: flex;
  align-items: center;
  gap: $spacing-2;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-800;
  margin: 0 0 $spacing-1;

  .el-icon { color: $primary-500; }
}

.block-desc {
  font-size: $font-size-sm;
  color: $gray-500;
  margin: 0 0 $spacing-4;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
}

.device-item {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-4;
  background: $gray-50;
  border-radius: $radius-lg;
  transition: $transition-fast;

  &:hover {
    background: rgba($primary-500, 0.05);
  }
}

.device-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $bg-card;
  border-radius: $radius-lg;
  color: $primary-500;
}

.device-info {
  flex: 1;
}

.device-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-800;
  display: flex;
  align-items: center;
  gap: $spacing-2;
}

.device-meta {
  font-size: $font-size-xs;
  color: $gray-500;
  margin-top: 2px;
}

.device-time {
  font-size: $font-size-xs;
  color: $gray-400;
  margin-top: 2px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

.history-item {
  display: flex;
  align-items: center;
  gap: $spacing-3;
  padding: $spacing-3;
  background: $gray-50;
  border-radius: $radius-md;
}

.history-status {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &.success {
    background: rgba($success-color, 0.1);
    color: $success-color;
  }

  &.failed {
    background: rgba($danger-color, 0.1);
    color: $danger-color;
  }
}

.history-info {
  flex: 1;
}

.history-main {
  font-size: $font-size-sm;
  color: $gray-700;
}

.history-meta {
  font-size: $font-size-xs;
  color: $gray-400;
}

.pwd-form {
  max-width: 400px;
  margin-top: $spacing-4;
}

.form-input {
  :deep(.el-input__wrapper) {
    border-radius: $radius-lg;
    border: 2px solid $gray-200;
    transition: $transition-fast;

    &:hover { border-color: $gray-300; }

    &.is-focus {
      border-color: $primary-500;
      box-shadow: 0 0 0 3px rgba($primary-500, 0.1);
    }
  }
}

.submit-btn {
  height: 40px;
  padding: 0 $spacing-6;
  background: $gradient-primary;
  border: none;
  border-radius: $radius-lg;
  font-weight: $font-weight-semibold;
  transition: $transition-slow;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-primary;
  }
}
</style>
