<template>
  <div class="users-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">用户管理</span>
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索用户名/手机号"
              style="width: 240px; margin-left: 16px;"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="searchForm.status" placeholder="用户状态" clearable style="width: 120px; margin-left: 12px;">
              <el-option label="正常" value="active" />
              <el-option label="冻结" value="frozen" />
              <el-option label="封禁" value="banned" />
            </el-select>
            <el-select v-model="searchForm.memberLevel" placeholder="会员等级" clearable style="width: 120px; margin-left: 12px;">
              <el-option label="普通会员" value="normal" />
              <el-option label="银卡会员" value="silver" />
              <el-option label="金卡会员" value="gold" />
              <el-option label="VIP会员" value="vip" />
            </el-select>
            <el-button type="primary" style="margin-left: 12px;" @click="handleSearch">
              <el-icon><Search /></el-icon>查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
          <div class="header-right">
            <el-button type="success" @click="handleExport">
              <el-icon><Download /></el-icon>导出
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="userList" v-loading="loading" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="100" />
        <el-table-column prop="memberLevel" label="会员等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getMemberLevelType(row.memberLevel)" size="small">
              {{ formatMemberLevel(row.memberLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="formatStatus(row.status, 'user').type" size="small">
              {{ formatStatus(row.status, 'user').text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authStatus" label="认证状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.authStatus === 'approved'" type="success" size="small">已认证</el-tag>
            <el-tag v-else-if="row.authStatus === 'pending'" type="warning" size="small">待审核</el-tag>
            <el-tag v-else type="info" size="small">未认证</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-dropdown @command="(cmd: string) => handleMore(cmd, row)">
              <el-button type="primary" link size="small">
                更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="freeze" v-if="row.status === 'active'">冻结账号</el-dropdown-item>
                  <el-dropdown-item command="unfreeze" v-if="row.status === 'frozen'">解冻账号</el-dropdown-item>
                  <el-dropdown-item command="ban" v-if="row.status !== 'banned'">封禁账号</el-dropdown-item>
                  <el-dropdown-item command="unban" v-if="row.status === 'banned'">解封账号</el-dropdown-item>
                  <el-dropdown-item divided command="delete" style="color: #f5222d;">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 用户详情/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'view' ? '用户详情' : '编辑用户'"
      width="600px"
    >
      <el-form :model="userForm" label-width="100px" :disabled="dialogType === 'view'">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="userForm.realName" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="userForm.memberLevel" style="width: 100%;">
            <el-option label="普通会员" value="normal" />
            <el-option label="银卡会员" value="silver" />
            <el-option label="金卡会员" value="gold" />
            <el-option label="VIP会员" value="vip" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="frozen">冻结</el-radio>
            <el-radio label="banned">封禁</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" v-if="dialogType === 'edit'">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate, formatStatus, formatMemberLevel } from '@/utils/format'
import type { User } from '@/types'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'view' | 'edit'>('view')

const searchForm = reactive({
  keyword: '',
  status: '',
  memberLevel: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const userForm = reactive<Partial<User>>({})

// 模拟用户数据
const userList = ref<User[]>([
  {
    id: 1,
    username: 'zhangsan',
    phone: '13800138001',
    realName: '张三',
    email: 'zhangsan@example.com',
    memberLevel: 'gold',
    status: 'active',
    authStatus: 'approved',
    createdAt: '2026-01-15 10:30:00',
    lastLoginAt: '2026-04-04 09:20:00'
  },
  {
    id: 2,
    username: 'lisi',
    phone: '13800138002',
    realName: '李四',
    memberLevel: 'normal',
    status: 'active',
    authStatus: 'pending',
    createdAt: '2026-02-20 14:25:00',
    lastLoginAt: '2026-04-03 16:45:00'
  },
  {
    id: 3,
    username: 'wangwu',
    phone: '13800138003',
    realName: '王五',
    memberLevel: 'vip',
    status: 'frozen',
    authStatus: 'approved',
    createdAt: '2026-01-08 09:15:00',
    lastLoginAt: '2026-03-28 11:30:00'
  },
  {
    id: 4,
    username: 'zhaoliu',
    phone: '13800138004',
    realName: '赵六',
    memberLevel: 'silver',
    status: 'active',
    authStatus: 'approved',
    createdAt: '2026-03-10 16:20:00',
    lastLoginAt: '2026-04-04 08:10:00'
  },
  {
    id: 5,
    username: 'qianqi',
    phone: '13800138005',
    realName: '钱七',
    memberLevel: 'normal',
    status: 'banned',
    authStatus: 'rejected',
    createdAt: '2026-02-05 11:45:00'
  }
])

const getMemberLevelType = (level: string) => {
  const typeMap: Record<string, string> = {
    normal: '',
    silver: 'info',
    gold: 'warning',
    vip: 'danger'
  }
  return typeMap[level] || ''
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.memberLevel = ''
  handleSearch()
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleView = (row: User) => {
  dialogType.value = 'view'
  Object.assign(userForm, row)
  dialogVisible.value = true
}

const handleEdit = (row: User) => {
  dialogType.value = 'edit'
  Object.assign(userForm, row)
  dialogVisible.value = true
}

const handleSave = () => {
  ElMessage.success('保存成功')
  dialogVisible.value = false
}

const handleMore = async (command: string, row: User) => {
  switch (command) {
    case 'freeze':
      await ElMessageBox.confirm('确定要冻结该用户账号吗？', '提示', { type: 'warning' })
      row.status = 'frozen'
      ElMessage.success('冻结成功')
      break
    case 'unfreeze':
      row.status = 'active'
      ElMessage.success('解冻成功')
      break
    case 'ban':
      await ElMessageBox.confirm('确定要封禁该用户账号吗？', '提示', { type: 'warning' })
      row.status = 'banned'
      ElMessage.success('封禁成功')
      break
    case 'unban':
      row.status = 'active'
      ElMessage.success('解封成功')
      break
    case 'delete':
      await ElMessageBox.confirm('确定要删除该用户吗？此操作不可恢复！', '警告', { type: 'error' })
      ElMessage.success('删除成功')
      break
  }
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
  handleSearch()
}

onMounted(() => {
  pagination.total = 125
})
</script>

<style scoped lang="scss">
.users-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .header-left {
      display: flex;
      align-items: center;
      
      .title {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
