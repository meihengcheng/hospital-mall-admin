<template>
  <div class="error-container">
    <div class="error-content">
      <el-icon :size="120" color="#1890ff"><Warning /></el-icon>
      <h1 class="error-code">404</h1>
      <p class="error-message">抱歉，您访问的页面不存在</p>
      <el-button type="primary" size="large" @click="$router.push('/dashboard')">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.error-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.error-content {
  text-align: center;
}

.error-code {
  font-size: 72px;
  font-weight: 700;
  color: #262626;
  margin: 24px 0 16px;
}

.error-message {
  font-size: 18px;
  color: #8c8c8c;
  margin-bottom: 32px;
}
</style>
