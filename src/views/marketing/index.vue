<template>
  <div class="marketing-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">营销管理</span>
          <el-button type="primary" @click="handleAddCoupon">
            <el-icon><Plus /></el-icon>新增优惠券
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="优惠券" name="coupon">
          <el-table :data="couponList" stripe>
            <el-table-column prop="name" label="优惠券名称" min-width="150" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                {{ row.type === 'full_reduction' ? '满减券' : '折扣券' }}
              </template>
            </el-table-column>
            <el-table-column prop="value" label="优惠金额/折扣" width="120">
              <template #default="{ row }">
                {{ row.type === 'full_reduction' ? `¥${row.value}` : `${row.value}折` }}
              </template>
            </el-table-column>
            <el-table-column prop="minAmount" label="使用门槛" width="120">
              <template #default="{ row }">
                满{{ row.minAmount }}元可用
              </template>
            </el-table-column>
            <el-table-column prop="totalCount" label="发放总量" width="100" />
            <el-table-column prop="usedCount" label="已使用" width="100" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                  {{ row.status === 'active' ? '进行中' : '已结束' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="primary" link size="small">编辑</el-button>
                <el-button type="danger" link size="small">结束</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="满减活动" name="activity">满减活动管理</el-tab-pane>
        <el-tab-pane label="积分规则" name="points">积分规则设置</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('coupon')

const couponList = ref([
  {
    id: 1,
    name: '新用户专享券',
    type: 'full_reduction',
    value: 20,
    minAmount: 100,
    totalCount: 1000,
    usedCount: 256,
    status: 'active',
    startTime: '2026-04-01',
    endTime: '2026-04-30'
  },
  {
    id: 2,
    name: '满200减50',
    type: 'full_reduction',
    value: 50,
    minAmount: 200,
    totalCount: 500,
    usedCount: 189,
    status: 'active',
    startTime: '2026-04-01',
    endTime: '2026-04-15'
  },
  {
    id: 3,
    name: '会员专享8折券',
    type: 'discount',
    value: 8,
    minAmount: 0,
    totalCount: 200,
    usedCount: 156,
    status: 'inactive',
    startTime: '2026-03-01',
    endTime: '2026-03-31'
  }
])

const handleAddCoupon = () => {
  ElMessage.info('新增优惠券')
}
</script>

<style scoped lang="scss">
.marketing-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
