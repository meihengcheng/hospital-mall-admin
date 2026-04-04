<template>
  <div class="delivery-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">配送管理</span>
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

      <el-table :data="deliveryList" v-loading="loading" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column label="商品" min-width="200">
          <template #default="{ row }">
            {{ row.products?.map((p: any) => p.name).join(', ') }}
          </template>
        </el-table-column>
        <el-table-column prop="shippingAddress" label="收货地址" min-width="250" show-overflow-tooltip />
        <el-table-column prop="contactPhone" label="联系电话" width="130" />
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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 'processing'">
              <el-button type="success" link size="small" @click="handleShip(row)">发货</el-button>
            </template>
            <template v-else-if="row.status === 'shipped'">
              <el-button type="warning" link size="small" @click="handleCancelShip(row)">取消发货</el-button>
            </template>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatMoney } from '@/utils/format'
import type { Order } from '@/types'
import request from '@/utils/request'

const loading = ref(false)

const searchForm = reactive({
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const deliveryList = ref<Order[]>([])

const getDeliveryList = async () => {
  loading.value = true
  try {
    const response = await request.get('/orders', {
      params: {
        page: pagination.page,
        limit: pagination.pageSize,
        status: searchForm.status
      }
    })
    deliveryList.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取配送列表失败')
  } finally {
    loading.value = false
  }
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
  getDeliveryList()
}

const handleReset = () => {
  searchForm.status = ''
  pagination.page = 1
  getDeliveryList()
}

const handlePageChange = () => {
  getDeliveryList()
}

const handleShip = async (row: Order) => {
  await ElMessageBox.confirm('确定要发货吗？', '提示', { type: 'warning' })
  try {
    await request.put(`/orders/${row.id}/status`, { status: 'shipped' })
    ElMessage.success('发货成功')
    getDeliveryList()
  } catch (error: any) {
    ElMessage.error(error.message || '发货失败，请重试')
  }
}

const handleCancelShip = async (row: Order) => {
  await ElMessageBox.confirm('确定要取消发货吗？', '提示', { type: 'warning' })
  try {
    await request.put(`/orders/${row.id}/status`, { status: 'processing' })
    ElMessage.success('取消发货成功')
    getDeliveryList()
  } catch (error: any) {
    ElMessage.error(error.message || '取消发货失败，请重试')
  }
}

onMounted(() => {
  getDeliveryList()
})
</script>

<style scoped lang="scss">
.delivery-container {
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
