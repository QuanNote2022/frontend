<template>
  <div class="profile-form">
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="用户名">
        <el-input :model-value="userStore.userInfo?.username" disabled class="form-input" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" placeholder="请输入昵称" class="form-input" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱" class="form-input" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" class="submit-btn" @click="handleSubmit">
          <el-icon><Check /></el-icon>
          保存修改
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

defineProps<{ loading: boolean }>()
const emit = defineEmits<{ (e: 'submit', data: { nickname: string; email: string }): void }>()

const userStore = useUserStore()
const form = reactive({ nickname: '', email: '' })

onMounted(() => {
  if (userStore.userInfo) {
    form.nickname = userStore.userInfo.nickname || ''
    form.email = userStore.userInfo.email || ''
  }
})

function handleSubmit() {
  emit('submit', { nickname: form.nickname, email: form.email })
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.profile-form {
  max-width: 500px;
}

.form-input {
  :deep(.el-input__wrapper) {
    border-radius: $radius-lg;
    border: 2px solid $gray-200;
    transition: $transition-fast;

    &:hover {
      border-color: $gray-300;
    }

    &.is-focus {
      border-color: $primary-500;
      box-shadow: 0 0 0 3px rgba($primary-500, 0.1);
    }
  }
}

.submit-btn {
  height: 44px;
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
