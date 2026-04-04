<template>
  <div class="finance-container">
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" style="background: #e6f7ff; color: #1890ff;">
              <el-icon :size="24"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥128,560.50</div>
              <div class="stat-label">今日收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">
              <el-icon :size="24"><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥3,256,890.00</div>
              <div class="stat-label">本月收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" style="background: #fff7e6; color: #faad14;">
              <el-icon :size="24"><Refund /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥12,580.00</div>
              <div class="stat-label">今日退款</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" style="background: #fff2f0; color: #f5222d;">
              <el-icon :size="24"><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥156.80</div>
              <div class="stat-label">客单价</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span class="title">交易记录</span>
          <el-button type="primary">导出账单</el-button>
        </div>
      </template>

      <el-table :data="transactionList" stripe>
        <el-table-column prop="transactionNo" label="交易号" width="180" />
        <el-table-column prop="orderNo" label="订单号" width="160" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'income' ? 'success' : 'danger'" size="small">
              {{ row.type === 'income' ? '收入' : '支出' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.type === 'income' ? '#52c41a' : '#f5222d' }">
              {{ row.type === 'income' ? '+' : '-' }}{{ formatMoney(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="channel" label="支付渠道" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'success'" type="success" size="small">成功</el-tag>
            <el-tag v-else type="danger" size="small">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="交易时间" width="160" />
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { formatMoney } from '@/utils/format'

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const transactionList = ref([
  {
    id: 1,
    transactionNo: 'TR202604040001',
    orderNo: 'DD202604040001',
    type: 'income',
    amount: 268.50,
    channel: '微信支付',
    status: 'success',
    createdAt: '2026-04-04 14:31:20'
  },
  {
    id: 2,
    transactionNo: 'TR202604040002',
    orderNo: 'DD202604040002',
    type: 'income',
    amount: 156.00,
    channel: '支付宝',
    status: 'success',
    createdAt: '2026-04-04 14:25:10'
  },
  {
    id: 3,
    transactionNo: 'TR202604040003',
    orderNo: 'DD202604040003',
    type: 'income',
    amount: 468.00,
    channel: '微信支付',
    status: 'success',
    createdAt: '2026-04-04 14:22:05'
  },
  {
    id: 4,
    transactionNo: 'TR202604030156',
    orderNo: 'DD202604030156',
    type: 'expense',
    amount: 89.50,
    channel: '原路退回',
    status: 'success',
    createdAt: '2026-04-03 16:45:30'
  }
])

onMounted(() => {
  pagination.total = 1256
})
</script>

<style scoped lang="scss">
.finance-container {
  .stats-row {
    .stat-item {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
      }

      .stat-info {
        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #262626;
        }

        .stat-label {
          font-size: 12px;
          color: #8c8c8c;
          margin-top: 4px;
        }
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
