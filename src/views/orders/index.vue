<template>
  <div class="orders-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">订单管理</span>
            <el-select v-model="searchForm.status" placeholder="订单状态" clearable style="width: 140px; margin-left: 16px;">
              <el-option label="待支付" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已发货" value="shipped" />
              <el-option label="已收货" value="delivered" />
              <el-option label="已取消" value="cancelled" />
            </el-select>
            <el-button type="primary" style="margin-left: 12px;" @click="handleSearch">
              <el-icon><Search /></el-icon>查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="orderList" v-loading="loading" stripe>
        <el-table-column type="index" width="55" />
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column label="商品" min-width="200">
          <template #default="{ row }">
            {{ row.products?.map((p: any) => p.name).join(', ') }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="{ row }">
            {{ formatMoney(row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.status)" size="small">
              {{ getOrderStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="支付状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.paymentStatus === 'paid' ? 'success' : 'warning'" size="small">
              {{ row.paymentStatus === 'paid' ? '已支付' : '未支付' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="shippingAddress" label="收货地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="contactPhone" label="联系电话" width="130" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
            <template v-if="row.status === 'processing'">
              <el-button type="success" link size="small" @click="handleShip(row)">发货</el-button>
            </template>
            <template v-else-if="row.status === 'shipped'">
              <el-button type="warning" link size="small" @click="handleCancelShip(row)">取消发货</el-button>
            </template>
            <el-dropdown @command="(status: string) => handleChangeStatus(row, status)" trigger="click">
              <el-button type="primary" link size="small">
                修改状态
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="pending" :disabled="row.status === 'pending'">待支付</el-dropdown-item>
                  <el-dropdown-item command="processing" :disabled="row.status === 'processing'">处理中</el-dropdown-item>
                  <el-dropdown-item command="shipped" :disabled="row.status === 'shipped'">已发货</el-dropdown-item>
                  <el-dropdown-item command="delivered" :disabled="row.status === 'delivered'">已收货</el-dropdown-item>
                  <el-dropdown-item command="cancelled" :disabled="row.status === 'cancelled'">已取消</el-dropdown-item>
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
          @size-change="handlePageChange"
          @current-change="handlePageChange"
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
              <el-tag :type="getOrderStatusType(currentOrder.status)">
                {{ getOrderStatusText(currentOrder.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="支付状态">
              <el-tag :type="currentOrder.paymentStatus === 'paid' ? 'success' : 'warning'">
                {{ currentOrder.paymentStatus === 'paid' ? '已支付' : '未支付' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatDate(currentOrder.createdAt) }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <div class="section-title">商品信息</div>
          <el-table :data="currentOrder.products" border size="small">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="price" label="单价" width="100">
              <template #default="{ row }">{{ formatMoney(row.price) }}</template>
            </el-table-column>
            <el-table-column label="小计" width="100">
              <template #default="{ row }">{{ formatMoney(row.price * row.quantity) }}</template>
            </el-table-column>
          </el-table>
        </div>

        <div class="detail-section">
          <div class="section-title">收货信息</div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="收货地址">{{ currentOrder.shippingAddress || '-' }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentOrder.contactPhone || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <div class="section-title">费用明细</div>
          <div class="fee-info">
            <div class="fee-item">
              <span>商品总额：</span>
              <span>{{ formatMoney(currentOrder.totalAmount) }}</span>
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
import { ArrowDown } from '@element-plus/icons-vue'
import { formatMoney } from '@/utils/format'
import type { Order } from '@/types'
import request from '@/utils/request'

const loading = ref(false)
const detailVisible = ref(false)
const currentOrder = ref<Order | null>(null)

const searchForm = reactive({
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 订单数据
const orderList = ref<Order[]>([])

// 获取订单列表
const getOrders = async () => {
  loading.value = true
  try {
    const response = await request.get('/orders', {
      params: {
        page: pagination.page,
        limit: pagination.pageSize,
        status: searchForm.status
      }
    })
    orderList.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

const getOrderStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || ''
}

const getOrderStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待支付',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已收货',
    cancelled: '已取消'
  }
  return textMap[status] || status
}

const handleSearch = () => {
  pagination.page = 1
  getOrders()
}

const handleReset = () => {
  searchForm.status = ''
  pagination.page = 1
  getOrders()
}

// 分页变化
const handlePageChange = () => {
  getOrders()
}

const handleView = (row: Order) => {
  currentOrder.value = row
  detailVisible.value = true
}

const handleShip = async (row: Order) => {
  await ElMessageBox.confirm('确定要发货吗？', '提示', { type: 'warning' })
  try {
    await request.put(`/orders/${row.id}/status`, { status: 'shipped' })
    ElMessage.success('发货成功')
    getOrders()
  } catch (error: any) {
    ElMessage.error(error.message || '发货失败，请重试')
  }
}

const handleCancelShip = async (row: Order) => {
  await ElMessageBox.confirm('确定要取消发货吗？', '提示', { type: 'warning' })
  try {
    await request.put(`/orders/${row.id}/status`, { status: 'processing' })
    ElMessage.success('取消发货成功')
    getOrders()
  } catch (error: any) {
    ElMessage.error(error.message || '取消发货失败，请重试')
  }
}

const handleChangeStatus = async (row: Order, status: string) => {
  await ElMessageBox.confirm(`确定要将订单状态修改为${getOrderStatusText(status)}吗？`, '提示', { type: 'warning' })
  try {
    await request.put(`/orders/${row.id}/status`, { status })
    ElMessage.success('修改状态成功')
    getOrders()
  } catch (error: any) {
    ElMessage.error(error.message || '修改状态失败，请重试')
  }
}

onMounted(() => {
  getOrders()
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
