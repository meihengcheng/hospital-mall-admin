<template>
  <div class="delivery-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">配送管理</span>
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索订单号/收货人"
              style="width: 240px; margin-left: 16px;"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="searchForm.status" placeholder="配送状态" clearable style="width: 120px; margin-left: 12px;">
              <el-option label="待发货" value="pending" />
              <el-option label="配送中" value="delivering" />
              <el-option label="已送达" value="delivered" />
              <el-option label="已签收" value="received" />
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
        <el-table-column prop="orderNo" label="订单号" width="160" />
        <el-table-column prop="userName" label="收货人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="120" />
        <el-table-column prop="address" label="收货地址" min-width="250" show-overflow-tooltip />
        <el-table-column prop="status" label="配送状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="carrier" label="配送方式" width="120">
          <template #default="{ row }">
            {{ row.carrier || '医院配送' }}
          </template>
        </el-table-column>
        <el-table-column prop="trackingNo" label="物流单号" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleShip(row)">
              发货
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

    <!-- 发货弹窗 -->
    <el-dialog v-model="shipDialogVisible" title="订单发货" width="500px">
      <el-form :model="shipForm" label-width="100px">
        <el-form-item label="配送方式">
          <el-radio-group v-model="shipForm.type">
            <el-radio label="self">医院配送</el-radio>
            <el-radio label="express">第三方物流</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="shipForm.type === 'express'" label="物流公司">
          <el-select v-model="shipForm.carrier" style="width: 100%;">
            <el-option label="顺丰速运" value="顺丰速运" />
            <el-option label="京东物流" value="京东物流" />
            <el-option label="中通快递" value="中通快递" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="shipForm.type === 'express'" label="物流单号">
          <el-input v-model="shipForm.trackingNo" placeholder="请输入物流单号" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="shipForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleShipSubmit">确认发货</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const shipDialogVisible = ref(false)

const searchForm = reactive({
  keyword: '',
  status: ''
})

const shipForm = reactive({
  type: 'self',
  carrier: '',
  trackingNo: '',
  remark: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const deliveryList = ref([
  {
    id: 1,
    orderNo: 'DD202604040001',
    userName: '张三',
    phone: '13800138001',
    address: '北京市朝阳区某某街道123号',
    status: 'delivering',
    carrier: '顺丰速运',
    trackingNo: 'SF1234567890'
  },
  {
    id: 2,
    orderNo: 'DD202604040003',
    userName: '王五',
    phone: '13800138003',
    address: '北京市海淀区某某路456号',
    status: 'pending'
  },
  {
    id: 3,
    orderNo: 'DD202604040006',
    userName: '孙八',
    phone: '13800138008',
    address: '北京市丰台区某某街789号',
    status: 'delivered',
    carrier: '京东物流',
    trackingNo: 'JD9876543210'
  }
])

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    pending: 'info',
    delivering: 'warning',
    delivered: 'success',
    received: 'success'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待发货',
    delivering: '配送中',
    delivered: '已送达',
    received: '已签收'
  }
  return map[status] || status
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  handleSearch()
}

const handleView = (row: any) => {
  ElMessage.info('查看配送详情')
}

const handleShip = (row: any) => {
  shipForm.type = 'self'
  shipForm.carrier = ''
  shipForm.trackingNo = ''
  shipForm.remark = ''
  shipDialogVisible.value = true
}

const handleShipSubmit = () => {
  ElMessage.success('发货成功')
  shipDialogVisible.value = false
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
  pagination.total = 45
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
