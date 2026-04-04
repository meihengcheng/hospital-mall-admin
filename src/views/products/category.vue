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

      <el-table :data="categoryList" row-key="id" default-expand-all>
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
        <el-form-item label="上级分类">
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
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')

const categoryForm = ref({
  id: 0,
  name: '',
  parentId: undefined as number | undefined,
  sort: 0,
  status: 'on'
})

const categoryList = ref([
  {
    id: 1,
    name: '药品',
    level: 1,
    sort: 1,
    status: 'on',
    children: [
      { id: 11, name: '处方药', parentId: 1, level: 2, sort: 1, status: 'on' },
      { id: 12, name: 'OTC药品', parentId: 1, level: 2, sort: 2, status: 'on' },
      { id: 13, name: '中药饮片', parentId: 1, level: 2, sort: 3, status: 'on' }
    ]
  },
  {
    id: 2,
    name: '医疗器械',
    level: 1,
    sort: 2,
    status: 'on',
    children: [
      { id: 21, name: '家用医疗器械', parentId: 2, level: 2, sort: 1, status: 'on' },
      { id: 22, name: '康复辅助器具', parentId: 2, level: 2, sort: 2, status: 'on' },
      { id: 23, name: '医用耗材', parentId: 2, level: 2, sort: 3, status: 'on' }
    ]
  },
  {
    id: 3,
    name: '保健品',
    level: 1,
    sort: 3,
    status: 'on',
    children: [
      { id: 31, name: '保健食品', parentId: 3, level: 2, sort: 1, status: 'on' },
      { id: 32, name: '营养补充剂', parentId: 3, level: 2, sort: 2, status: 'on' }
    ]
  }
])

const parentCategories = computed(() => {
  return categoryList.value.filter(item => item.level === 1)
})

const handleAdd = () => {
  dialogType.value = 'add'
  categoryForm.value = { id: 0, name: '', parentId: undefined, sort: 0, status: 'on' }
  dialogVisible.value = true
}

const handleAddSub = (row: any) => {
  dialogType.value = 'add'
  categoryForm.value = { id: 0, name: '', parentId: row.id, sort: 0, status: 'on' }
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  categoryForm.value = { ...row }
  dialogVisible.value = true
}

const handleSave = () => {
  ElMessage.success(dialogType.value === 'add' ? '新增成功' : '保存成功')
  dialogVisible.value = false
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm('确定要删除该分类吗？', '警告', { type: 'error' })
  ElMessage.success('删除成功')
}
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
