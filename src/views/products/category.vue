<template>
  <div class="category-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">商品分类管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增分类
          </el-button>
        </div>
      </template>

      <el-table :data="categoryList" row-key="id" default-expand-all v-loading="loading">
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="{ row }">
            <el-icon v-if="row.level === 1" style="margin-right: 8px;"><Folder /></el-icon>
            <el-icon v-else style="margin-right: 8px;"><Document /></el-icon>
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="层级" width="80">
          <template #default="{ row }">
            {{ row.level === 1 ? '一级' : '二级' }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'on' ? 'success' : 'info'" size="small">
              {{ row.status === 'on' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button v-if="row.level === 1" type="primary" link size="small" @click="handleAddSub(row)">
              添加子分类
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分类编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增分类' : '编辑分类'" width="500px">
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="上级分类" v-if="dialogType === 'add'">
          <el-select v-model="categoryForm.parentId" style="width: 100%;" placeholder="请选择上级分类（不选则为一级分类）" clearable>
            <el-option
              v-for="item in parentCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.sort" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="categoryForm.status">
            <el-radio label="on">启用</el-radio>
            <el-radio label="off">禁用</el-radio>
          </el-radio-group>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Folder, Document } from '@element-plus/icons-vue'
import request from '@/utils/request'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

const categoryForm = ref({
  id: '',
  name: '',
  parentId: null as string | null,
  sort: 0,
  status: 'on'
})

const categoryList = ref<any[]>([])
const flatCategories = ref<any[]>([])

const parentCategories = computed(() => {
  return flatCategories.value.filter(item => item.level === 1)
})

const getCategories = async () => {
  loading.value = true
  try {
    const [treeRes, flatRes] = await Promise.all([
      request.get('/categories'),
      request.get('/categories/flat')
    ])
    categoryList.value = treeRes.data
    flatCategories.value = flatRes.data
  } catch (error) {
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  categoryForm.value = { id: '', name: '', parentId: null, sort: 0, status: 'on' }
  dialogVisible.value = true
}

const handleAddSub = (row: any) => {
  dialogType.value = 'add'
  categoryForm.value = { id: '', name: '', parentId: row.id, sort: 0, status: 'on' }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  categoryForm.value = { 
    id: row.id, 
    name: row.name, 
    parentId: row.parentId || null, 
    sort: row.sort, 
    status: row.status 
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!categoryForm.value.name) {
    ElMessage.warning('请输入分类名称')
    return
  }

  try {
    if (dialogType.value === 'add') {
      await request.post('/categories', categoryForm.value)
      ElMessage.success('新增成功')
    } else {
      await request.put(`/categories/${categoryForm.value.id}`, categoryForm.value)
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    getCategories()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '警告', { type: 'error' })
    await request.delete(`/categories/${row.id}`)
    ElMessage.success('删除成功')
    getCategories()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  getCategories()
})
</script>

<style scoped lang="scss">
.category-container {
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
