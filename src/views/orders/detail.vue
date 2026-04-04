<template>
  <div class="order-detail-page">
    <el-page-header @back="$router.back()" title="订单详情" />
    
    <el-card shadow="hover" style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-tag :type="formatStatus(order.status, 'order').type" size="large">
            {{ formatStatus(order.status, 'order').text }}
          </el-tag>
        </div>
      </template>
      
      <el-descriptions :column="3" border>
        <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ formatDate(order.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="订单来源">微信小程序</el-descriptions-item>
        <el-descriptions-item label="用户">{{ order.userName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">13800138001</el-descriptions-item>
        <el-descriptions-item label="配送方式">
          {{ order.deliveryType === 'self' ? '院内自提' : '配送到家' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    
    <el-card shadow="hover" style="margin-top: 16px;">
      <template #header>
        <span>商品信息</span>
      </template>
      <el-table :data="order.items" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="productName" label="商品名称" min-width="200" />
        <el-table-column prop="specification" label="规格" width="150" />
        <el-table-column prop="price" label="单价" width="100">
          <template #default="{ row }">{{ formatMoney(row.price) }}</template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="subtotal" label="小计" width="100">
          <template #default="{ row }">{{ formatMoney(row.subtotal) }}</template>
        </el-table-column>
      </el-table>
      
      <div class="order-total">
        <div class="total-row">
          <span>商品总额：</span>
          <span>{{ formatMoney(order.totalAmount) }}</span>
        </div>
        <div class="total-row">
          <span>运费：</span>
          <span>{{ formatMoney(0) }}</span>
        </div>
        <div class="total-row">
          <span>优惠金额：</span>
          <span>{{ formatMoney(0) }}</span>
        </div>
        <div class="total-row grand">
          <span>实付金额：</span>
          <span class="amount">{{ formatMoney(order.totalAmount) }}</span>
        </div>
      </div>
    </el-card>
    
    <el-card shadow="hover" style="margin-top: 16px;">
      <template #header>
        <span>物流信息</span>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :type="index === 0 ? 'primary' : ''"
          :timestamp="activity.time"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatMoney, formatDate, formatStatus } from '@/utils/format'

const order = ref({
  orderNo: 'DD202604040001',
  userName: '张三',
  status: 'shipped',
  deliveryType: 'delivery',
  totalAmount: 268.50,
  createdAt: '2026-04-04 14:30:00',
  items: [
    { productName: '阿莫西林胶囊', specification: '0.25g*24粒', price: 18.50, quantity: 2, subtotal: 37.00 },
    { productName: '感冒灵颗粒', specification: '10g*9袋', price: 23.50, quantity: 1, subtotal: 23.50 }
  ]
})

const activities = ref([
  { content: '订单已发货，顺丰速运：SF1234567890', time: '2026-04-04 16:30:00' },
  { content: '订单支付成功', time: '2026-04-04 14:31:20' },
  { content: '订单提交成功', time: '2026-04-04 14:30:00' }
])
</script>

<style scoped lang="scss">
.order-detail-page {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .order-total {
    margin-top: 20px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 4px;
    text-align: right;
    
    .total-row {
      margin-bottom: 8px;
      
      &.grand {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #d9d9d9;
        font-size: 16px;
        font-weight: 600;
        
        .amount {
          color: #f5222d;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
