<template>
  <div class="orders-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">订单管理</span>
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索订单号/用户名"
              style="width: 240px; margin-left: 16px;"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="searchForm.status" placeholder="订单状态" clearable style="width: 120px; margin-left: 12px;">
              <el-option label="待支付" value="pending" />
              <el-option label="已支付" value="paid" />
              <el-option label="处理中" value="processing" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px; margin-left: 12px;"
            />
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

      <el-table :data="orderList" v-loading="loading" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="orderNo" label="订单号" width="160" />
        <el-table-column prop="userName" label="用户" width="100" />
        <el-table-column prop="items" label="商品" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.items.map((item: any) => item.productName).join(', ') }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="金额" width="100">
          <template #default="{ row }">
            <span style="color: #f5222d; font-weight: 600;">{{ formatMoney(row.totalAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="formatStatus(row.status, 'order').type" size="small">
              {{ formatStatus(row.status, 'order').text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryType" label="配送方式" width="90">
          <template #default="{ row }">
            <el-tag v-if="row.deliveryType === 'self'" type="info" size="small">自提</el-tag>
            <el-tag v-else type="success" size="small">配送</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
            <el-button
              v-if="row.status === 'paid'"
              type="success"
              link
              size="small"
              @click="handleShip(row)"
            >
              发货
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="danger"
              link
              size="small"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
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

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-section">
          <div class="section-title">订单信息</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="formatStatus(currentOrder.status, 'order').type">
                {{ formatStatus(currentOrder.status, 'order').text }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ formatDate(currentOrder.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="配送方式">
              {{ currentOrder.deliveryType === 'self' ? '院内自提' : '配送到家' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <div class="section-title">用户信息</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户姓名">{{ currentOrder.userName }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">13800138001</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <div class="section-title">商品信息</div>
          <el-table :data="currentOrder.items" border size="small">
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="specification" label="规格" width="120" />
            <el-table-column prop="price" label="单价" width="100">
              <template #default="{ row }">{{ formatMoney(row.price) }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="subtotal" label="小计" width="100">
              <template #default="{ row }">{{ formatMoney(row.subtotal) }}</template>
            </el-table-column>
          </el-table>
        </div>

        <div class="detail-section">
          <div class="section-title">费用明细</div>
          <div class="fee-info">
            <div class="fee-item">
              <span>商品总额：</span>
              <span>{{ formatMoney(currentOrder.totalAmount) }}</span>
            </div>
            <div class="fee-item">
              <span>运费：</span>
              <span>{{ formatMoney(0) }}</span>
            </div>
            <div class="fee-item total">
              <span>实付金额：</span>
              <span style="color: #f5222d; font-size: 18px; font-weight: 600;">
                {{ formatMoney(currentOrder.totalAmount) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatMoney, formatDate, formatStatus } from '@/utils/format'
import type { Order } from '@/types'

const loading = ref(false)
const detailVisible = ref(false)
const currentOrder = ref<Order | null>(null)

const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 模拟订单数据
const orderList = ref<Order[]>([
  {
    id: 1,
    orderNo: 'DD202604040001',
    userId: 1,
    userName: '张三',
    totalAmount: 268.50,
    status: 'paid',
    deliveryType: 'delivery',
    address: {
      name: '张三',
      phone: '13800138001',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '某某街道123号'
    },
    items: [
      { id: 1, productId: 1, productName: '阿莫西林胶囊', specification: '0.25g*24粒', price: 18.50, quantity: 2, subtotal: 37.00 },
      { id: 2, productId: 2, productName: '感冒灵颗粒', specification: '10g*9袋', price: 23.50, quantity: 1, subtotal: 23.50 }
    ],
    createdAt: '2026-04-04 14:30:00',
    paidAt: '2026-04-04 14:31:20'
  },
  {
    id: 2,
    orderNo: 'DD202604040002',
    userId: 2,
    userName: '李四',
    totalAmount: 156.00,
    status: 'pending',
    deliveryType: 'self',
    items: [
      { id: 3, productId: 3, productName: '维生素C片', specification: '100mg*100片', price: 28.00, quantity: 2, subtotal: 56.00 }
    ],
    createdAt: '2026-04-04 14:25:00'
  },
  {
    id: 3,
    orderNo: 'DD202604040003',
    userId: 3,
    userName: '王五',
    totalAmount: 468.00,
    status: 'shipped',
    deliveryType: 'delivery',
    items: [
      { id: 4, productId: 4, productName: '血压计', specification: '电子腕式', price: 298.00, quantity: 1, subtotal: 298.00 }
    ],
    createdAt: '2026-04-04 14:20:00',
    paidAt: '2026-04-04 14:22:00',
    shippedAt: '2026-04-04 16:30:00'
  },
  {
    id: 4,
    orderNo: 'DD202604040004',
    userId: 4,
    userName: '赵六',
    totalAmount: 89.50,
    status: 'completed',
    deliveryType: 'self',
    items: [
      { id: 5, productId: 5, productName: '创可贴', specification: '100片/盒', price: 19.50, quantity: 1, subtotal: 19.50 }
    ],
    createdAt: '2026-04-04 14:15:00',
    paidAt: '2026-04-04 14:16:00',
    shippedAt: '2026-04-04 14:20:00',
    completedAt: '2026-04-04 18:00:00'
  },
  {
    id: 5,
    orderNo: 'DD202604040005',
    userId: 5,
    userName: '钱七',
    totalAmount: 356.00,
    status: 'processing',
    deliveryType: 'delivery',
    items: [
      { id: 6, productId: 6, productName: '血糖仪', specification: '含50片试纸', price: 198.00, quantity: 1, subtotal: 198.00 }
    ],
    createdAt: '2026-04-04 14:10:00',
    paidAt: '2026-04-04 14:12:00'
  }
])

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleView = (row: Order) => {
  currentOrder.value = row
  detailVisible.value = true
}

const handleShip = async (row: Order) => {
  await ElMessageBox.confirm('确定要发货吗？', '提示', { type: 'warning' })
  row.status = 'shipped'
  row.shippedAt = new Date().toISOString()
  ElMessage.success('发货成功')
}

const handleCancel = async (row: Order) => {
  await ElMessageBox.confirm('确定要取消该订单吗？', '警告', { type: 'error' })
  row.status = 'cancelled'
  ElMessage.success('订单已取消')
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
  pagination.total = 328
})
</script>

<style scoped lang="scss">
.orders-container {
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

  .order-detail {
    .detail-section {
      margin-bottom: 24px;

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #262626;
        margin-bottom: 12px;
        padding-left: 8px;
        border-left: 3px solid #1890ff;
      }
    }

    .fee-info {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;

      .fee-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        &.total {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #d9d9d9;
        }
      }
    }
  }
}
</style>
