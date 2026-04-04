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
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
            <el-select v-model="searchForm.status" placeholder="商品状态" clearable style="width: 120px; margin-left: 12px;">
              <el-option label="上架" value="active" />
              <el-option label="下架" value="inactive" />
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
          </div>
        </div>
      </template>
      
      <el-table :data="productList" v-loading="loading" stripe>
        <el-table-column type="index" width="55" />
        <el-table-column prop="name" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            {{ formatMoney(row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100">
          <template #default="{ row }">
            {{ row.stock }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'prescription' ? 'danger' : 'success'" size="small">
              {{ row.type === 'prescription' ? '处方药' : '普通商品' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiryDate" label="有效期至" width="120">
          <template #default="{ row }">
            {{ row.expiryDate ? formatDate(row.expiryDate) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              type="primary" 
              link 
              size="small" 
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 'active' ? '下架' : '上架' }}
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
          @size-change="handlePageChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    
    <!-- 商品编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增商品' : '编辑商品'"
      width="600px"
    >
      <el-form :model="productForm" label-width="100px" :rules="formRules" ref="formRef">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="productForm.category" style="width: 100%;" placeholder="请选择分类">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品类型" prop="type">
          <el-radio-group v-model="productForm.type">
            <el-radio label="general">普通商品</el-radio>
            <el-radio label="prescription">处方药</el-radio>
          </el-radio-group>
        </el-form-item>
        
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
        
        <el-form-item label="有效期至" prop="expiryDate">
          <el-date-picker v-model="productForm.expiryDate" type="date" style="width: 100%;" />
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
import { formatMoney } from '@/utils/format'
import type { Product } from '@/types'
import request from '@/utils/request'

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
  status: 'active',
  type: 'general',
  description: ''
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
}

// 商品数据
const productList = ref<Product[]>([])
const categoryList = ref<any[]>([])

// 获取分类列表
const getCategories = async () => {
  try {
    const response = await request.get('/categories/flat')
    categoryList.value = response.data
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  }
}

// 获取商品列表
const getProducts = async () => {
  loading.value = true
  try {
    const response = await request.get('/products', {
      params: {
        page: pagination.page,
        limit: pagination.pageSize,
        category: searchForm.category,
        status: searchForm.status
      }
    })
    productList.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleSearch = () => {
  pagination.page = 1
  getProducts()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.category = ''
  searchForm.status = ''
  pagination.page = 1
  getProducts()
}

// 分页变化
const handlePageChange = () => {
  getProducts()
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(productForm, {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active',
    type: 'general',
    description: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Product) => {
  dialogType.value = 'edit'
  Object.assign(productForm, row)
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (dialogType.value === 'add') {
          // 新增商品
          await request.post('/products', productForm)
          ElMessage.success('新增成功')
        } else {
          // 编辑商品
          await request.put(`/products/${productForm.id}`, productForm)
          ElMessage.success('保存成功')
        }
        dialogVisible.value = false
        // 重新获取商品列表
        getProducts()
      } catch (error: any) {
        ElMessage.error(error.message || '保存失败，请重试')
      }
    }
  })
}

const handleToggleStatus = async (row: Product) => {
  const action = row.status === 'active' ? '下架' : '上架'
  await ElMessageBox.confirm(`确定要${action}该商品吗？`, '提示', { type: 'warning' })
  try {
    // 调用后端 API 更新状态
    await request.put(`/products/${row.id}`, {
      status: row.status === 'active' ? 'inactive' : 'active'
    })
    row.status = row.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`${action}成功`)
    // 重新获取商品列表
    getProducts()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败，请重试')
  }
}

const handleDelete = async (row: Product) => {
  await ElMessageBox.confirm('确定要删除该商品吗？', '警告', { type: 'error' })
  try {
    // 调用后端 API 删除商品
    await request.delete(`/products/${row.id}`)
    ElMessage.success('删除成功')
    // 重新获取商品列表
    getProducts()
  } catch (error: any) {
    ElMessage.error(error.message || '删除失败，请重试')
  }
}

onMounted(() => {
  getCategories()
  getProducts()
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
  
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
