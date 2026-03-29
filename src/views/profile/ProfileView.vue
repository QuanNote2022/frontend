<template>
  <div class="page-container">
    <h2 class="page-title">个人中心</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="profile-avatar-section">
            <el-avatar :size="80" :src="userStore.userInfo?.avatar || undefined">
              {{ userStore.userInfo?.nickname?.charAt(0) || 'U' }}
            </el-avatar>
            <h3>{{ userStore.userInfo?.nickname || '用户' }}</h3>
            <p class="text-muted">{{ userStore.userInfo?.email }}</p>
            <p class="text-muted">注册时间：{{ formatDate(userStore.userInfo?.createdAt || '') }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <span>基本信息</span>
          </template>
          <el-form ref="profileFormRef" :model="profileForm" label-width="80px" @submit.prevent="handleUpdateProfile">
            <el-form-item label="用户名">
              <el-input :model-value="userStore.userInfo?.username" disabled />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="profileLoading" @click="handleUpdateProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="hover" style="margin-top: 20px;">
          <template #header>
            <span>修改密码</span>
          </template>
          <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px" @submit.prevent="handleUpdatePassword">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="pwdForm.oldPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="pwdForm.confirmPassword" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="pwdLoading" @click="handleUpdatePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { updatePasswordApi } from '@/api/user'
import { formatDate } from '@/utils/format'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const userStore = useUserStore()

const profileFormRef = ref<FormInstance>()
const profileLoading = ref(false)
const profileForm = reactive({ nickname: '', email: '' })

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

onMounted(() => {
  if (userStore.userInfo) {
    profileForm.nickname = userStore.userInfo.nickname || ''
    profileForm.email = userStore.userInfo.email || ''
  }
})

async function handleUpdateProfile() {
  profileLoading.value = true
  try {
    await userStore.updateProfile(profileForm)
    ElMessage.success('信息更新成功')
  } catch {
    // handled
  } finally {
    profileLoading.value = false
  }
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
    // handled
  } finally {
    pwdLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.page-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #303133;
}
.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  h3 { margin: 12px 0 4px; font-size: 18px; }
  .text-muted { color: #909399; font-size: 13px; margin-top: 4px; }
}
</style>
