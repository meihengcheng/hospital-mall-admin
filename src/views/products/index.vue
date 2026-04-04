<template>
  <div class="products-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">商品管理</span>
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
            <el-select v-model="searchForm.category" placeholder="商品分类" clearable style="width: 140px; margin-left: 12px;">
              <el-option label="处方药" value="prescription" />
              <el-option label="OTC药品" value="otc" />
              <el-option label="医疗器械" value="device" />
              <el-option label="保健品" value="health" />
            </el-select>
            <el-select v-model="searchForm.status" placeholder="商品状态" clearable style="width: 120px; margin-left: 12px;">
              <el-option label="上架" value="on" />
              <el-option label="下架" value="off" />
            </el-select>
            <el-button type="primary" style="margin-left: 12px;" @click="handleSearch">
              <el-icon><Search /></el-icon>查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>新增商品
            </el-button>
            <el-button @click="handleImport">
              <el-icon><Upload /></el-icon>批量导入
            </el-button>
            <el-button @click="handleExport">
              <el-icon><Download /></el-icon>导出
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="productList" v-loading="loading" stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image 
              :src="row.images[0] || '/placeholder.png'" 
              style="width: 60px; height: 60px; border-radius: 4px;"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            {{ getCategoryName(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="specification" label="规格" width="150" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            {{ formatMoney(row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-danger': row.stock < row.safetyStock }">
              {{ row.stock }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="formatStatus(row.status, 'product').type" size="small">
              {{ formatStatus(row.status, 'product').text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiryDate" label="有效期至" width="120">
          <template #default="{ row }">
            <span v-if="isNearExpiry(row.expiryDate)" style="color: #f5222d;">
              {{ row.expiryDate }}
            </span>
            <span v-else>{{ row.expiryDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              type="primary" 
              link 
              size="small" 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'on' ? '下架' : '上架' }}
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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
    
    <!-- 商品编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增商品' : '编辑商品'"
      width="700px"
    >
      <el-form :model="productForm" label-width="100px" :rules="formRules" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="productForm.name" placeholder="请输入商品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品分类" prop="category">
              <el-select v-model="productForm.category" style="width: 100%;" placeholder="请选择分类">
                <el-option label="处方药" value="prescription" />
                <el-option label="OTC药品" value="otc" />
                <el-option label="医疗器械" value="device" />
                <el-option label="保健品" value="health" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规格" prop="specification">
              <el-input v-model="productForm.specification" placeholder="如：0.25g*24粒" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input v-model="productForm.manufacturer" placeholder="请输入生产厂家" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="productForm.price" :min="0" :precision="2" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="productForm.stock" :min="0" :precision="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="安全库存" prop="safetyStock">
              <el-input-number v-model="productForm.safetyStock" :min="0" :precision="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期至" prop="expiryDate">
              <el-date-picker v-model="productForm.expiryDate" type="date" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="批准文号" prop="approvalNumber">
          <el-input v-model="productForm.approvalNumber" placeholder="请输入药品批准文号" />
        </el-form-item>
        
        <el-form-item label="商品图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="5"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="productForm.description" type="textarea" :rows="4" placeholder="请输入商品描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { formatMoney, formatStatus } from '@/utils/format'
import type { Product } from '@/types'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance>()

const searchForm = reactive({
  keyword: '',
  category: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const productForm = reactive<Partial<Product>>({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  safetyStock: 10,
  status: 'on',
  specification: '',
  manufacturer: '',
  images: []
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
}

// 模拟商品数据
const productList = ref<Product[]>([
  {
    id: 1,
    name: '阿莫西林胶囊',
    category: 'prescription',
    categoryId: 1,
    price: 18.50,
    stock: 256,
    safetyStock: 50,
    status: 'on',
    specification: '0.25g*24粒',
    manufacturer: '华北制药',
    approvalNumber: '国药准字H13020726',
    expiryDate: '2027-06-30',
    images: [],
    description: '适用于敏感菌所致的各种感染',
    createdAt: '2026-01-10 09:00:00',
    updatedAt: '2026-04-01 14:30:00'
  },
  {
    id: 2,
    name: '感冒灵颗粒',
    category: 'otc',
    categoryId: 2,
    price: 23.50,
    stock: 189,
    safetyStock: 30,
    status: 'on',
    specification: '10g*9袋',
    manufacturer: '三九医药',
    approvalNumber: '国药准字Z44022180',
    expiryDate: '2027-03-15',
    images: [],
    description: '解热镇痛，用于感冒引起的头痛、发热',
    createdAt: '2026-01-15 10:20:00',
    updatedAt: '2026-03-28 11:00:00'
  },
  {
    id: 3,
    name: '电子血压计',
    category: 'device',
    categoryId: 3,
    price: 298.00,
    stock: 45,
    safetyStock: 10,
    status: 'on',
    specification: '电子腕式',
    manufacturer: '欧姆龙',
    images: [],
    description: '家用电子血压计，精准测量',
    createdAt: '2026-02-01 14:00:00',
    updatedAt: '2026-03-20 09:30:00'
  },
  {
    id: 4,
    name: '维生素C片',
    category: 'health',
    categoryId: 4,
    price: 28.00,
    stock: 8,
    safetyStock: 20,
    status: 'on',
    specification: '100mg*100片',
    manufacturer: '养生堂',
    approvalNumber: '国食健字G20100500',
    expiryDate: '2026-12-31',
    images: [],
    description: '补充维生素C，增强免疫力',
    createdAt: '2026-02-10 11:30:00',
    updatedAt: '2026-04-02 16:00:00'
  },
  {
    id: 5,
    name: '血糖仪',
    category: 'device',
    categoryId: 3,
    price: 198.00,
    stock: 0,
    safetyStock: 15,
    status: 'off',
    specification: '含50片试纸',
    manufacturer: '罗氏',
    images: [],
    description: '家用血糖监测仪',
    createdAt: '2026-02-20 09:00:00',
    updatedAt: '2026-03-25 10:00:00'
  }
])

const getCategoryName = (category: string) => {
  const map: Record<string, string> = {
    prescription: '处方药',
    otc: 'OTC药品',
    device: '医疗器械',
    health: '保健品'
  }
  return map[category] || category
}

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
  searchForm.category = ''
  searchForm.status = ''
  handleSearch()
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(productForm, {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    safetyStock: 10,
    status: 'on',
    specification: '',
    manufacturer: '',
    images: [],
    description: ''
  })
  dialogVisible.value = true
}

const handleImport = () => {
  ElMessage.info('批量导入功能开发中')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleView = (row: Product) => {
  ElMessage.info('查看商品详情')
}

const handleEdit = (row: Product) => {
  dialogType.value = 'edit'
  Object.assign(productForm, row)
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '保存成功')
      dialogVisible.value = false
    }
  })
}

const handleToggleStatus = async (row: Product) => {
  const action = row.status === 'on' ? '下架' : '上架'
  await ElMessageBox.confirm(`确定要${action}该商品吗？`, '提示', { type: 'warning' })
  row.status = row.status === 'on' ? 'off' : 'on'
  ElMessage.success(`${action}成功`)
}

const handleDelete = async (row: Product) => {
  await ElMessageBox.confirm('确定要删除该商品吗？', '警告', { type: 'error' })
  ElMessage.success('删除成功')
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
  pagination.total = 156
})
</script>

<style scoped lang="scss">
.products-container {
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
