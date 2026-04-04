<template>
  <div class="records-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">库存记录</span>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-table :data="recordList" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="productName" label="商品名称" min-width="200" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'in' ? 'success' : 'danger'" size="small">
              {{ row.type === 'in' ? '入库' : '出库' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="subtype" label="子类型" width="120" />
        <el-table-column prop="quantity" label="数量" width="100">
          <template #default="{ row }">
            <span :style="{ color: row.type === 'in' ? '#52c41a' : '#f5222d' }">
              {{ row.type === 'in' ? '+' : '-' }}{{ row.quantity }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="beforeStock" label="变动前" width="100" />
        <el-table-column prop="afterStock" label="变动后" width="100" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="操作时间" width="160" />
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const recordList = ref([
  {
    id: 1,
    productName: '阿莫西林胶囊',
    type: 'in',
    subtype: '采购入库',
    quantity: 100,
    beforeStock: 156,
    afterStock: 256,
    operator: '王药师',
    remark: '从华北制药采购',
    createdAt: '2026-04-04 10:30:00'
  },
  {
    id: 2,
    productName: '阿莫西林胶囊',
    type: 'out',
    subtype: '销售出库',
    quantity: 10,
    beforeStock: 266,
    afterStock: 256,
    operator: '系统自动',
    remark: '订单DD202604040001',
    createdAt: '2026-04-04 14:35:00'
  },
  {
    id: 3,
    productName: '感冒灵颗粒',
    type: 'in',
    subtype: '采购入库',
    quantity: 50,
    beforeStock: 139,
    afterStock: 189,
    operator: '李药师',
    remark: '从三九医药采购',
    createdAt: '2026-04-03 09:00:00'
  }
])

onMounted(() => {
  pagination.total = 156
})
</script>

<style scoped lang="scss">
.records-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
