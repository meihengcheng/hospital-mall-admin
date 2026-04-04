<template>
  <div class="prescriptions-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">处方管理</span>
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索处方号/患者姓名"
              style="width: 240px; margin-left: 16px;"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="searchForm.status" placeholder="审核状态" clearable style="width: 120px; margin-left: 12px;">
              <el-option label="待审核" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已拒绝" value="rejected" />
            </el-select>
            <el-button type="primary" style="margin-left: 12px;" @click="handleSearch">
              <el-icon><Search /></el-icon>查询
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
          <div class="header-right">
            <el-badge :value="pendingCount" class="badge-item">
              <el-button type="warning" @click="handlePending">
                待审核处方
              </el-button>
            </el-badge>
          </div>
        </div>
      </template>

      <el-table :data="prescriptionList" v-loading="loading" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column prop="prescriptionNo" label="处方号" width="160" />
        <el-table-column prop="patientName" label="患者姓名" width="100" />
        <el-table-column prop="doctorName" label="开具医生" width="100" />
        <el-table-column prop="diagnosis" label="诊断" min-width="150" show-overflow-tooltip />
        <el-table-column prop="items" label="药品数量" width="90">
          <template #default="{ row }">
            {{ row.items.length }} 种
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态" width="90">
          <template #default="{ row }">
            <el-tag :type="formatStatus(row.status, 'prescription').type" size="small">
              {{ formatStatus(row.status, 'prescription').text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="开具时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="success"
              link
              size="small"
              @click="handleReview(row)"
            >
              审核
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

    <!-- 处方详情/审核弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'review' ? '处方审核' : '处方详情'"
      width="700px"
    >
      <div v-if="currentPrescription" class="prescription-detail">
        <div class="detail-section">
          <div class="section-title">处方信息</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="处方号">{{ currentPrescription.prescriptionNo }}</el-descriptions-item>
            <el-descriptions-item label="开具时间">{{ formatDate(currentPrescription.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="医生">{{ currentPrescription.doctorName }}</el-descriptions-item>
            <el-descriptions-item label="患者">{{ currentPrescription.patientName }}</el-descriptions-item>
            <el-descriptions-item label="诊断" :span="2">{{ currentPrescription.diagnosis }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <div class="section-title">药品信息</div>
          <el-table :data="currentPrescription.items" border size="small">
            <el-table-column type="index" width="50" />
            <el-table-column prop="productName" label="药品名称" min-width="150" />
            <el-table-column prop="specification" label="规格" width="120" />
            <el-table-column prop="dosage" label="剂量" width="100" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="usage" label="用法" min-width="150" />
          </el-table>
        </div>

        <div v-if="dialogType === 'review'" class="detail-section">
          <div class="section-title">审核意见</div>
          <el-form :model="reviewForm" label-width="80px">
            <el-form-item label="审核结果">
              <el-radio-group v-model="reviewForm.result">
                <el-radio label="approved">通过</el-radio>
                <el-radio label="rejected">拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核备注">
              <el-input
                v-model="reviewForm.note"
                type="textarea"
                :rows="3"
                placeholder="请输入审核备注（拒绝时必填）"
              />
            </el-form-item>
          </el-form>
        </div>

        <div v-if="currentPrescription.status !== 'pending'" class="detail-section">
          <div class="section-title">审核记录</div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="审核结果">
              <el-tag :type="formatStatus(currentPrescription.status, 'prescription').type">
                {{ formatStatus(currentPrescription.status, 'prescription').text }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="审核时间">{{ formatDate(currentPrescription.reviewedAt || '') }}</el-descriptions-item>
            <el-descriptions-item label="审核备注">{{ currentPrescription.reviewNote || '-' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button v-if="dialogType === 'review'" type="primary" @click="handleReviewSubmit">
          确认审核
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate, formatStatus } from '@/utils/format'
import type { Prescription } from '@/types'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogType = ref<'view' | 'review'>('view')
const currentPrescription = ref<Prescription | null>(null)

const searchForm = reactive({
  keyword: '',
  status: ''
})

const reviewForm = reactive({
  result: 'approved',
  note: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 模拟处方数据
const prescriptionList = ref<Prescription[]>([
  {
    id: 1,
    prescriptionNo: 'CF202604040001',
    doctorId: 1,
    doctorName: '李医生',
    patientId: 1,
    patientName: '张三',
    diagnosis: '上呼吸道感染',
    items: [
      { id: 1, productId: 1, productName: '阿莫西林胶囊', specification: '0.25g*24粒', dosage: '0.5g', quantity: 2, usage: '每日3次，每次1粒' },
      { id: 2, productId: 2, productName: '感冒灵颗粒', specification: '10g*9袋', dosage: '10g', quantity: 1, usage: '每日3次，每次1袋' }
    ],
    status: 'pending',
    createdAt: '2026-04-04 14:30:00'
  },
  {
    id: 2,
    prescriptionNo: 'CF202604040002',
    doctorId: 2,
    doctorName: '王医生',
    patientId: 2,
    patientName: '李四',
    diagnosis: '高血压',
    items: [
      { id: 3, productId: 7, productName: '硝苯地平缓释片', specification: '20mg*30片', dosage: '20mg', quantity: 2, usage: '每日1次，每次1片' }
    ],
    status: 'approved',
    reviewNote: '审核通过',
    createdAt: '2026-04-04 13:20:00',
    reviewedAt: '2026-04-04 13:25:00'
  },
  {
    id: 3,
    prescriptionNo: 'CF202604040003',
    doctorId: 1,
    doctorName: '李医生',
    patientId: 3,
    patientName: '王五',
    diagnosis: '糖尿病',
    items: [
      { id: 4, productId: 8, productName: '二甲双胍片', specification: '0.5g*60片', dosage: '0.5g', quantity: 3, usage: '每日2次，每次1片' }
    ],
    status: 'rejected',
    reviewNote: '用药剂量超标，请重新开具',
    createdAt: '2026-04-04 11:15:00',
    reviewedAt: '2026-04-04 11:20:00'
  },
  {
    id: 4,
    prescriptionNo: 'CF202604040004',
    doctorId: 3,
    doctorName: '张医生',
    patientId: 4,
    patientName: '赵六',
    diagnosis: '急性肠胃炎',
    items: [
      { id: 5, productId: 9, productName: '诺氟沙星胶囊', specification: '0.1g*24粒', dosage: '0.2g', quantity: 2, usage: '每日3次，每次2粒' },
      { id: 6, productId: 10, productName: '蒙脱石散', specification: '3g*10袋', dosage: '3g', quantity: 1, usage: '每日3次，每次1袋' }
    ],
    status: 'pending',
    createdAt: '2026-04-04 10:30:00'
  },
  {
    id: 5,
    prescriptionNo: 'CF202604040005',
    doctorId: 2,
    doctorName: '王医生',
    patientId: 5,
    patientName: '钱七',
    diagnosis: '冠心病',
    items: [
      { id: 7, productId: 11, productName: '阿司匹林肠溶片', specification: '100mg*30片', dosage: '100mg', quantity: 1, usage: '每日1次，每次1片' }
    ],
    status: 'approved',
    reviewNote: '审核通过',
    createdAt: '2026-04-04 09:45:00',
    reviewedAt: '2026-04-04 09:50:00'
  }
])

const pendingCount = computed(() => {
  return prescriptionList.value.filter(item => item.status === 'pending').length
})

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

const handlePending = () => {
  searchForm.status = 'pending'
  handleSearch()
}

const handleView = (row: Prescription) => {
  dialogType.value = 'view'
  currentPrescription.value = row
  dialogVisible.value = true
}

const handleReview = (row: Prescription) => {
  dialogType.value = 'review'
  currentPrescription.value = row
  reviewForm.result = 'approved'
  reviewForm.note = ''
  dialogVisible.value = true
}

const handleReviewSubmit = async () => {
  if (!currentPrescription.value) return

  if (reviewForm.result === 'rejected' && !reviewForm.note) {
    ElMessage.warning('拒绝时请填写审核备注')
    return
  }

  await ElMessageBox.confirm('确定要提交审核结果吗？', '提示', { type: 'warning' })

  currentPrescription.value.status = reviewForm.result as 'approved' | 'rejected'
  currentPrescription.value.reviewNote = reviewForm.note
  currentPrescription.value.reviewedAt = new Date().toISOString()

  ElMessage.success('审核成功')
  dialogVisible.value = false
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
  pagination.total = 56
})
</script>

<style scoped lang="scss">
.prescriptions-container {
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

    .badge-item {
      :deep(.el-badge__content) {
        top: 8px;
        right: 8px;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .prescription-detail {
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
  }
}
</style>
