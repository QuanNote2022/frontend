<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 登录头部 -->
      <div class="login-header">
        <el-icon :size="40" color="#409eff"><Aim /></el-icon>
        <h2>智能矿物识别系统</h2>
        <p>基于YOLO与LLM协同的科普问答平台</p>
      </div>
      <!-- 登录表单 -->
      <el-form ref="formRef" :model="form" :rules="rules" size="large" @submit.prevent>
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password @keyup.enter.prevent="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" class="login-btn" @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
      <!-- 登录底部 -->
      <div class="login-footer">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

/**
 * 登录页面组件
 * 提供用户登录功能，包括表单验证和登录逻辑
 */

// 路由和状态管理
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单引用和状态
const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

/**
 * 表单验证规则
 */
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
}

/**
 * 处理登录逻辑
 * 1. 验证表单
 * 2. 调用登录接口
 * 3. 登录成功后跳转
 */
async function handleLogin() {
  if (loading.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    // 调用用户 store 的登录方法
    await userStore.login(form)
    ElMessage.success('登录成功')
    // 获取重定向地址，默认为首页
    const redirect = (route.query.redirect as string) || '/'
    await router.push(redirect)
  } catch (err: any) {
    console.error('登录失败:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.login-header {
  text-align: center;
  margin-bottom: 32px;
  h2 {
    margin: 12px 0 8px;
    color: #303133;
    font-size: 22px;
  }
  p {
    color: #909399;
    font-size: 13px;
  }
}
.login-btn {
  width: 100%;
}
.login-footer {
  text-align: center;
  font-size: 14px;
  color: #909399;
  a {
    color: #409eff;
    &:hover { text-decoration: underline; }
  }
}
</style>
