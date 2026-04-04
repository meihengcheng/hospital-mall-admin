<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <el-icon :size="48" color="#1890ff"><FirstAidKit /></el-icon>
        <h1 class="title">医院商城管理后台</h1>
        <p class="subtitle">Hospital Mall Admin System</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              prefix-icon="Key"
              size="large"
            />
            <div class="captcha-img" @click="refreshCaptcha">
              {{ captchaCode }}
            </div>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-tips">
        <p>演示账号：admin / 123456</p>
      </div>
    </div>
    
    <div class="login-footer">
      <p>© 2026 医院商城管理系统 版权所有</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)
const captchaCode = ref('')

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: ''
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value.toLowerCase() !== captchaCode.value.toLowerCase()) {
          callback(new Error('验证码错误'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 生成随机验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhjkmnprstwxyz2345678'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaCode.value = result
}

const refreshCaptcha = () => {
  generateCaptcha()
  loginForm.captcha = ''
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 设置登录状态
        userStore.setToken('mock_token_' + Date.now())
        userStore.setUserInfo({
          id: 1,
          username: loginForm.username,
          realName: '系统管理员',
          role: 'admin',
          roleName: '超级管理员',
          permissions: ['*']
        })
        
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } catch (error) {
        ElMessage.error('登录失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  padding: 20px;
  
  .login-box {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 8px;
    padding: 40px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    
    .login-header {
      text-align: center;
      margin-bottom: 32px;
      
      .title {
        font-size: 24px;
        font-weight: 600;
        color: #262626;
        margin: 16px 0 8px;
      }
      
      .subtitle {
        font-size: 14px;
        color: #8c8c8c;
      }
    }
    
    .login-form {
      .captcha-row {
        display: flex;
        gap: 12px;
        
        .el-input {
          flex: 1;
        }
        
        .captcha-img {
          width: 120px;
          height: 40px;
          background: #f0f2f5;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 4px;
          color: #1890ff;
          cursor: pointer;
          user-select: none;
        }
      }
      
      .login-btn {
        width: 100%;
      }
    }
    
    .login-tips {
      margin-top: 24px;
      text-align: center;
      color: #8c8c8c;
      font-size: 12px;
    }
  }
  
  .login-footer {
    margin-top: 48px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }
}
</style>
