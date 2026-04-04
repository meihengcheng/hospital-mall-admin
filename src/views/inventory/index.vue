<template>
  <div class="inventory-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">库存管理</span>
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索商品名称"
              style="width: 240px; margin-left: 16px;"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="searchForm.warehouse" placeholder="仓库" clearable style="width: 140px; margin-left: 12px;">
              <el-option label="中心药房" value="1" />
              <el-option label="门诊药房" value="2" />
              <el-option label="住院药房" value="3" />
            </el-select>
            <el-button type="primary" style="margin-left: 12px;" @click="handleSearch">
              <el-icon><Search /></el-icon>查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="handleInStock">
              <el-icon><Plus /></el-icon>入库
            </el-button>
            <el-button type="warning" @click="handleOutStock">
              <el-icon><Minus /></el-icon>出库
            </el-button>
            <el-button @click="handleRecords">
              <el-icon><List /></el-icon>库存记录
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="inventoryList" v-loading="loading" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="productName" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="warehouseName" label="仓库" width="120" />
        <el-table-column prop="quantity" label="总库存" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-danger': row.quantity < row.safetyStock }">
              {{ row.quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="lockedQuantity" label="锁定库存" width="100" />
        <el-table-column prop="availableQuantity" label="可用库存" width="100">
          <template #default="{ row }">
            <span style="color: #52c41a; font-weight: 600;">{{ row.availableQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="safetyStock" label="安全库存" width="100" />
        <el-table-column prop="expiryDate" label="有效期至" width="120">
          <template #default="{ row }">
            <span v-if="isNearExpiry(row.expiryDate)" style="color: #f5222d;">
              {{ row.expiryDate }}
            </span>
            <span v-else>{{ row.expiryDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.quantity < row.safetyStock" type="danger" size="small">库存不足</el-tag>
            <el-tag v-else-if="isNearExpiry(row.expiryDate)" type="warning" size="small">近效期</el-tag>
            <el-tag v-else type="success" size="small">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleAdjust(row)">调整</el-button>
            <el-button type="primary" link size="small" @click="handleTransfer(row)">调拨</el-button>
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

    <!-- 入库/出库弹窗 -->
    <el-dialog
      v-model="stockDialogVisible"
      :title="stockType === 'in' ? '商品入库' : '商品出库'"
      width="500px"
    >
      <el-form :model="stockForm" label-width="100px" :rules="stockRules" ref="stockFormRef">
        <el-form-item label="商品" prop="productId">
          <el-select v-model="stockForm.productId" style="width: 100%;" placeholder="请选择商品">
            <el-option
              v-for="item in productOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseId">
          <el-select v-model="stockForm.warehouseId" style="width: 100%;" placeholder="请选择仓库">
            <el-option label="中心药房" :value="1" />
            <el-option label="门诊药房" :value="2" />
            <el-option label="住院药房" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item :label="stockType === 'in' ? '入库数量' : '出库数量'" prop="quantity">
          <el-input-number v-model="stockForm.quantity" :min="1" :precision="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="stockForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleStockSave">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Inventory } from '@/types'

const loading = ref(false)
const stockDialogVisible = ref(false)
const stockType = ref<'in' | 'out'>('in')
const stockFormRef = ref<FormInstance>()

const searchForm = reactive({
  keyword: '',
  warehouse: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const stockForm = reactive({
  productId: undefined as number | undefined,
  warehouseId: undefined as number | undefined,
  quantity: 1,
  remark: ''
})

const stockRules: FormRules = {
  productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}

const productOptions = [
  { id: 1, name: '阿莫西林胶囊' },
  { id: 2, name: '感冒灵颗粒' },
  { id: 3, name: '维生素C片' },
  { id: 4, name: '电子血压计' },
  { id: 5, name: '血糖仪' }
]

// 模拟库存数据
const inventoryList = ref<Inventory[]>([
  {
    id: 1,
    productId: 1,
    productName: '阿莫西林胶囊',
    warehouseId: 1,
    warehouseName: '中心药房',
    quantity: 256,
    lockedQuantity: 10,
    availableQuantity: 246,
    safetyStock: 50,
    expiryDate: '2027-06-30',
    updatedAt: '2026-04-04 10:00:00'
  },
  {
    id: 2,
    productId: 2,
    productName: '感冒灵颗粒',
    warehouseId: 1,
    warehouseName: '中心药房',
    quantity: 189,
    lockedQuantity: 5,
    availableQuantity: 184,
    safetyStock: 30,
    expiryDate: '2027-03-15',
    updatedAt: '2026-04-04 09:30:00'
  },
  {
    id: 3,
    productId: 3,
    productName: '维生素C片',
    warehouseId: 2,
    warehouseName: '门诊药房',
    quantity: 8,
    lockedQuantity: 0,
    availableQuantity: 8,
    safetyStock: 20,
    expiryDate: '2026-12-31',
    updatedAt: '2026-04-04 08:00:00'
  },
  {
    id: 4,
    productId: 4,
    productName: '电子血压计',
    warehouseId: 1,
    warehouseName: '中心药房',
    quantity: 45,
    lockedQuantity: 2,
    availableQuantity: 43,
    safetyStock: 10,
    updatedAt: '2026-04-03 16:00:00'
  },
  {
    id: 5,
    productId: 5,
    productName: '血糖仪',
    warehouseId: 3,
    warehouseName: '住院药房',
    quantity: 0,
    lockedQuantity: 0,
    availableQuantity: 0,
    safetyStock: 15,
    updatedAt: '2026-04-03 14:00:00'
  }
])

const isNearExpiry = (date?: string) => {
  if (!date) return false
  const expiry = new Date(date)
  const now = new Date()
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 90 && diffDays > 0
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.warehouse = ''
  handleSearch()
}

const handleInStock = () => {
  stockType.value = 'in'
  stockForm.productId = undefined
  stockForm.warehouseId = undefined
  stockForm.quantity = 1
  stockForm.remark = ''
  stockDialogVisible.value = true
}

const handleOutStock = () => {
  stockType.value = 'out'
  stockForm.productId = undefined
  stockForm.warehouseId = undefined
  stockForm.quantity = 1
  stockForm.remark = ''
  stockDialogVisible.value = true
}

const handleRecords = () => {
  ElMessage.info('查看库存记录')
}

const handleAdjust = (row: Inventory) => {
  ElMessage.info('调整库存')
}

const handleTransfer = (row: Inventory) => {
  ElMessage.info('库存调拨')
}

const handleStockSave = async () => {
  if (!stockFormRef.value) return
  await stockFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(stockType.value === 'in' ? '入库成功' : '出库成功')
      stockDialogVisible.value = false
    }
  })
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
  pagination.total = 89
})
</script>

<style scoped lang="scss">
.inventory-container {
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

  .text-danger {
    color: #f5222d;
    font-weight: bold;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
