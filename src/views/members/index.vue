<template>
  <div class="members-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">会员管理</span>
            <el-button type="primary" style="margin-left: 16px;" @click="handleLevels">
              会员等级设置
            </el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="16" class="stats-row">
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">12,580</div>
            <div class="stat-label">总会员数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">3,240</div>
            <div class="stat-label">银卡会员</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">1,860</div>
            <div class="stat-label">金卡会员</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">520</div>
            <div class="stat-label">VIP会员</div>
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <el-table :data="memberList" v-loading="loading" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="level" label="会员等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">
              {{ getLevelText(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column prop="totalConsumption" label="累计消费" width="120">
          <template #default="{ row }">
            {{ formatMoney(row.totalConsumption) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderCount" label="订单数" width="80" />
        <el-table-column prop="joinDate" label="加入时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
            <el-button type="primary" link size="small" @click="handleAdjustPoints(row)">调整积分</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { formatMoney } from '@/utils/format'

const loading = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const memberList = ref([
  {
    id: 1,
    username: 'zhangsan',
    realName: '张三',
    phone: '13800138001',
    level: 'gold',
    points: 2580,
    totalConsumption: 12580,
    orderCount: 28,
    joinDate: '2026-01-15 10:30:00'
  },
  {
    id: 2,
    username: 'lisi',
    realName: '李四',
    phone: '13800138002',
    level: 'silver',
    points: 860,
    totalConsumption: 4680,
    orderCount: 12,
    joinDate: '2026-02-20 14:25:00'
  },
  {
    id: 3,
    username: 'wangwu',
    realName: '王五',
    phone: '13800138003',
    level: 'vip',
    points: 5680,
    totalConsumption: 35680,
    orderCount: 56,
    joinDate: '2026-01-08 09:15:00'
  }
])

const getLevelType = (level: string) => {
  const map: Record<string, string> = {
    normal: '',
    silver: 'info',
    gold: 'warning',
    vip: 'danger'
  }
  return map[level] || ''
}

const getLevelText = (level: string) => {
  const map: Record<string, string> = {
    normal: '普通会员',
    silver: '银卡会员',
    gold: '金卡会员',
    vip: 'VIP会员'
  }
  return map[level] || level
}

const handleLevels = () => {
  ElMessage.info('会员等级设置')
}

const handleView = (row: any) => {
  ElMessage.info('查看会员详情')
}

const handleAdjustPoints = (row: any) => {
  ElMessage.info('调整积分')
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
}

const handleCurrentChange = (val: number) => {
  pagination.page = val
}

onMounted(() => {
  pagination.total = 12580
})
</script>

<style scoped lang="scss">
.members-container {
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

  .stats-row {
    margin-bottom: 20px;

    .stat-item {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: center;

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #1890ff;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #8c8c8c;
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
