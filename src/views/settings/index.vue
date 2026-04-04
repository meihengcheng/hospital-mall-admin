<template>
  <div class="settings-container">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="basicForm" label-width="120px" style="max-width: 600px;">
          <el-form-item label="系统名称">
            <el-input v-model="basicForm.systemName" />
          </el-form-item>
          <el-form-item label="系统Logo">
            <el-upload action="#" :auto-upload="false">
              <el-button type="primary">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="basicForm.phone" />
          </el-form-item>
          <el-form-item label="联系地址">
            <el-input v-model="basicForm.address" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="管理员账号" name="admin">
        <div class="table-header">
          <el-button type="primary" @click="handleAddAdmin">
            <el-icon><Plus /></el-icon>新增管理员
          </el-button>
        </div>
        <el-table :data="adminList" stripe>
          <el-table-column prop="username" label="用户名" width="120" />
          <el-table-column prop="realName" label="真实姓名" width="100" />
          <el-table-column prop="role" label="角色" width="120" />
          <el-table-column prop="department" label="部门" width="120" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                {{ row.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastLoginAt" label="最后登录" width="160" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <el-button type="primary" link size="small">编辑</el-button>
              <el-button type="danger" link size="small">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="权限管理" name="permission">
        <el-tree
          :data="permissionData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="['1', '2']"
          :props="{ label: 'name' }"
        />
      </el-tab-pane>

      <el-tab-pane label="安全设置" name="security">
        <el-form :model="securityForm" label-width="150px" style="max-width: 600px;">
          <el-form-item label="密码最小长度">
            <el-input-number v-model="securityForm.passwordMinLength" :min="6" :max="20" />
          </el-form-item>
          <el-form-item label="登录失败锁定">
            <el-switch v-model="securityForm.loginLock" />
          </el-form-item>
          <el-form-item label="锁定阈值（次）">
            <el-input-number v-model="securityForm.lockThreshold" :min="3" :max="10" :disabled="!securityForm.loginLock" />
          </el-form-item>
          <el-form-item label="会话超时时间（分钟）">
            <el-input-number v-model="securityForm.sessionTimeout" :min="10" :max="120" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')

const basicForm = ref({
  systemName: '医院商城管理后台',
  phone: '010-12345678',
  address: '北京市朝阳区某某路1号'
})

const adminList = ref([
  { id: 1, username: 'admin', realName: '系统管理员', role: '超级管理员', department: '信息科', status: 'active', lastLoginAt: '2026-04-04 09:30:00' },
  { id: 2, username: 'pharmacy01', realName: '王药师', role: '药房管理员', department: '药房', status: 'active', lastLoginAt: '2026-04-04 08:15:00' },
  { id: 3, username: 'finance01', realName: '李会计', role: '财务人员', department: '财务科', status: 'active', lastLoginAt: '2026-04-03 17:20:00' }
])

const permissionData = ref([
  {
    id: '1',
    name: '用户管理',
    children: [
      { id: '1-1', name: '查看用户' },
      { id: '1-2', name: '编辑用户' },
      { id: '1-3', name: '删除用户' }
    ]
  },
  {
    id: '2',
    name: '商品管理',
    children: [
      { id: '2-1', name: '查看商品' },
      { id: '2-2', name: '新增商品' },
      { id: '2-3', name: '编辑商品' },
      { id: '2-4', name: '删除商品' }
    ]
  },
  {
    id: '3',
    name: '订单管理',
    children: [
      { id: '3-1', name: '查看订单' },
      { id: '3-2', name: '订单发货' },
      { id: '3-3', name: '取消订单' }
    ]
  }
])

const securityForm = ref({
  passwordMinLength: 8,
  loginLock: true,
  lockThreshold: 5,
  sessionTimeout: 30
})

const handleAddAdmin = () => {
  ElMessage.info('新增管理员')
}
</script>

<style scoped lang="scss">
.settings-container {
  .table-header {
    margin-bottom: 16px;
  }
}
</style>
