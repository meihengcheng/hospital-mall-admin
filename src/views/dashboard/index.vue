<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon sales">
              <el-icon :size="32"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">今日销售额</div>
              <div class="stat-value">{{ formatMoney(stats.todaySales) }}</div>
              <div class="stat-trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>+12.5%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon orders">
              <el-icon :size="32"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">今日订单数</div>
              <div class="stat-value">{{ stats.todayOrders }}</div>
              <div class="stat-trend up">
                <el-icon><ArrowUp /></el-icon>
                <span>+8.2%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon users">
              <el-icon :size="32"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">今日新增用户</div>
              <div class="stat-value">{{ stats.todayUsers }}</div>
              <div class="stat-trend down">
                <el-icon><ArrowDown /></el-icon>
                <span>-3.1%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon prescriptions">
              <el-icon :size="32"><FirstAidKit /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">待审核处方</div>
              <div class="stat-value">{{ stats.pendingPrescriptions }}</div>
              <div class="stat-trend warning">
                <span>需及时处理</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :lg="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="salesChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :lg="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品分类占比</span>
            </div>
          </template>
          <div ref="categoryChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 待办事项和快捷入口 -->
    <el-row :gutter="16" class="todo-row">
      <el-col :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <div class="todo-list">
            <div class="todo-item">
              <el-badge :value="stats.pendingPrescriptions" class="todo-badge">
                <el-icon :size="20" color="#faad14"><FirstAidKit /></el-icon>
              </el-badge>
              <div class="todo-content">
                <div class="todo-title">待审核处方</div>
                <div class="todo-desc">有 {{ stats.pendingPrescriptions }} 张处方等待审核</div>
              </div>
              <el-button type="primary" size="small" @click="$router.push('/prescriptions')">
                去处理
              </el-button>
            </div>
            
            <div class="todo-item">
              <el-badge :value="stats.pendingOrders" class="todo-badge">
                <el-icon :size="20" color="#1890ff"><Document /></el-icon>
              </el-badge>
              <div class="todo-content">
                <div class="todo-title">待发货订单</div>
                <div class="todo-desc">有 {{ stats.pendingOrders }} 个订单等待发货</div>
              </div>
              <el-button type="primary" size="small" @click="$router.push('/orders')">
                去处理
              </el-button>
            </div>
            
            <div class="todo-item">
              <el-badge :value="stats.lowStockProducts" class="todo-badge">
                <el-icon :size="20" color="#f5222d"><Box /></el-icon>
              </el-badge>
              <div class="todo-content">
                <div class="todo-title">库存预警</div>
                <div class="todo-desc">有 {{ stats.lowStockProducts }} 个商品库存不足</div>
              </div>
              <el-button type="primary" size="small" @click="$router.push('/inventory')">
                去处理
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷入口</span>
            </div>
          </template>
          <div class="quick-actions">
            <div class="action-item" @click="$router.push('/products')">
              <div class="action-icon" style="background: #e6f7ff; color: #1890ff;">
                <el-icon :size="24"><Plus /></el-icon>
              </div>
              <div class="action-text">新增商品</div>
            </div>
            
            <div class="action-item" @click="$router.push('/orders')">
              <div class="action-icon" style="background: #f6ffed; color: #52c41a;">
                <el-icon :size="24"><Document /></el-icon>
              </div>
              <div class="action-text">订单查询</div>
            </div>
            
            <div class="action-item" @click="$router.push('/prescriptions')">
              <div class="action-icon" style="background: #fff7e6; color: #faad14;">
                <el-icon :size="24"><FirstAidKit /></el-icon>
              </div>
              <div class="action-text">处方审核</div>
            </div>
            
            <div class="action-item" @click="$router.push('/marketing')">
              <div class="action-icon" style="background: #f9f0ff; color: #722ed1;">
                <el-icon :size="24"><Ticket /></el-icon>
              </div>
              <div class="action-text">发放优惠券</div>
            </div>
            
            <div class="action-item" @click="$router.push('/statistics')">
              <div class="action-icon" style="background: #fff2f0; color: #f5222d;">
                <el-icon :size="24"><TrendCharts /></el-icon>
              </div>
              <div class="action-text">数据报表</div>
            </div>
            
            <div class="action-item" @click="$router.push('/settings')">
              <div class="action-icon" style="background: #f5f5f5; color: #595959;">
                <el-icon :size="24"><Setting /></el-icon>
              </div>
              <div class="action-text">系统设置</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近订单 -->
    <el-card class="recent-orders" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>最近订单</span>
          <el-button type="primary" link @click="$router.push('/orders')">
            查看全部
          </el-button>
        </div>
      </template>
      <el-table :data="recentOrders" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column label="商品" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.products?.map((p: any) => p.name).join(', ') }}
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="金额" width="120">
          <template #default="{ row }">
            {{ formatMoney(row.totalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.status)" size="small">
              {{ getOrderStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { formatMoney, formatDate, formatStatus } from '@/utils/format'
import type { DashboardStats, Order } from '@/types'

const timeRange = ref('week')
const salesChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()
let salesChart: echarts.ECharts | null = null
let categoryChart: echarts.ECharts | null = null

// 统计数据
const stats = ref<DashboardStats>({
  todaySales: 25860.50,
  todayOrders: 156,
  todayUsers: 23,
  pendingPrescriptions: 8,
  lowStockProducts: 5,
  pendingOrders: 12
})

// 最近订单
const recentOrders = ref<Order[]>([
  {
    id: '1',
    orderNo: 'ORD202604040001',
    userId: '1',
    products: [
      { productId: '1', name: '阿莫西林胶囊', quantity: 2, price: 25.5 }
    ],
    totalAmount: 51.0,
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: '2026-04-04 14:30:00',
    updatedAt: '2026-04-04 14:30:00'
  },
  {
    id: '2',
    orderNo: 'ORD202604040002',
    userId: '2',
    products: [
      { productId: '2', name: '布洛芬缓释胶囊', quantity: 1, price: 18.8 }
    ],
    totalAmount: 18.8,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: '2026-04-04 14:25:00',
    updatedAt: '2026-04-04 14:25:00'
  },
  {
    id: '3',
    orderNo: 'ORD202604040003',
    userId: '3',
    products: [
      { productId: '4', name: '电子血压计', quantity: 1, price: 298.0 }
    ],
    totalAmount: 298.0,
    status: 'shipped',
    paymentStatus: 'paid',
    createdAt: '2026-04-04 14:20:00',
    updatedAt: '2026-04-04 14:20:00'
  },
  {
    id: '4',
    orderNo: 'ORD202604040004',
    userId: '4',
    products: [
      { productId: '7', name: '创可贴', quantity: 1, price: 5.5 }
    ],
    totalAmount: 5.5,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2026-04-04 14:15:00',
    updatedAt: '2026-04-04 14:15:00'
  },
  {
    id: '5',
    orderNo: 'ORD202604040005',
    userId: '5',
    products: [
      { productId: '6', name: '维生素C片', quantity: 1, price: 28.0 }
    ],
    totalAmount: 28.0,
    status: 'processing',
    paymentStatus: 'paid',
    createdAt: '2026-04-04 14:10:00',
    updatedAt: '2026-04-04 14:10:00'
  }
])

// 初始化销售趋势图
const initSalesChart = () => {
  if (!salesChartRef.value) return
  
  salesChart = echarts.init(salesChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['销售额', '订单数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额',
        axisLabel: { formatter: '¥{value}' }
      },
      {
        type: 'value',
        name: '订单数',
        axisLabel: { formatter: '{value}单' }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ])
        },
        data: [18203, 23489, 29034, 24970, 25760, 28650, 25860]
      },
      {
        name: '订单数',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [120, 145, 180, 165, 150, 175, 156]
      }
    ]
  }
  salesChart.setOption(option)
}

// 初始化分类占比图
const initCategoryChart = () => {
  if (!categoryChartRef.value) return
  
  categoryChart = echarts.init(categoryChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: 1048, name: '处方药', itemStyle: { color: '#1890ff' } },
          { value: 735, name: 'OTC药品', itemStyle: { color: '#52c41a' } },
          { value: 580, name: '医疗器械', itemStyle: { color: '#faad14' } },
          { value: 484, name: '保健品', itemStyle: { color: '#722ed1' } },
          { value: 300, name: '健康服务', itemStyle: { color: '#13c2c2' } }
        ]
      }
    ]
  }
  categoryChart.setOption(option)
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

// 监听窗口大小变化
const handleResize = () => {
  salesChart?.resize()
  categoryChart?.resize()
}

onMounted(() => {
  initSalesChart()
  initCategoryChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesChart?.dispose()
  categoryChart?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  .stat-row {
    margin-bottom: 16px;
    
    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        
        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          
          &.sales {
            background: #e6f7ff;
            color: #1890ff;
          }
          
          &.orders {
            background: #f6ffed;
            color: #52c41a;
          }
          
          &.users {
            background: #fff2f0;
            color: #f5222d;
          }
          
          &.prescriptions {
            background: #fff7e6;
            color: #faad14;
          }
        }
        
        .stat-info {
          flex: 1;
          
          .stat-title {
            font-size: 14px;
            color: #8c8c8c;
            margin-bottom: 8px;
          }
          
          .stat-value {
            font-size: 28px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 8px;
          }
          
          .stat-trend {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            
            &.up {
              color: #52c41a;
            }
            
            &.down {
              color: #f5222d;
            }
            
            &.warning {
              color: #faad14;
            }
          }
        }
      }
    }
  }
  
  .chart-row {
    margin-bottom: 16px;
    
    .chart-card {
      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .chart-container {
        height: 350px;
      }
    }
  }
  
  .todo-row {
    margin-bottom: 16px;
    
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .todo-list {
      .todo-item {
        display: flex;
        align-items: center;
        padding: 16px 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .todo-badge {
          margin-right: 16px;
        }
        
        .todo-content {
          flex: 1;
          
          .todo-title {
            font-size: 14px;
            font-weight: 500;
            color: #262626;
            margin-bottom: 4px;
          }
          
          .todo-desc {
            font-size: 12px;
            color: #8c8c8c;
          }
        }
      }
    }
    
    .quick-actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      
      .action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background: #f5f5f5;
        }
        
        .action-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        
        .action-text {
          font-size: 13px;
          color: #595959;
        }
      }
    }
  }
  
  .recent-orders {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
