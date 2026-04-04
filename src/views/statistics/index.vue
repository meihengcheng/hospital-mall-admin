<template>
  <div class="statistics-container">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势分析</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="salesChartRef" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>商品销量排行</span>
          </template>
          <div class="rank-list">
            <div v-for="(item, index) in productRank" :key="index" class="rank-item">
              <div class="rank-number" :class="{ top: index < 3 }">{{ index + 1 }}</div>
              <div class="rank-info">
                <div class="rank-name">{{ item.name }}</div>
                <el-progress :percentage="item.percentage" :color="getRankColor(index)" />
              </div>
              <div class="rank-sales">{{ item.sales }}单</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>用户增长趋势</span>
          </template>
          <div ref="userChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <span>订单状态分布</span>
          </template>
          <div ref="orderChartRef" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('week')
const salesChartRef = ref<HTMLElement>()
const userChartRef = ref<HTMLElement>()
const orderChartRef = ref<HTMLElement>()

let salesChart: echarts.ECharts | null = null
let userChart: echarts.ECharts | null = null
let orderChart: echarts.ECharts | null = null

const productRank = ref([
  { name: '阿莫西林胶囊', sales: 1256, percentage: 85 },
  { name: '感冒灵颗粒', sales: 986, percentage: 70 },
  { name: '维生素C片', sales: 856, percentage: 60 },
  { name: '电子血压计', sales: 658, percentage: 45 },
  { name: '血糖仪', sales: 520, percentage: 35 }
])

const getRankColor = (index: number) => {
  const colors = ['#f5222d', '#faad14', '#1890ff', '#52c41a', '#722ed1']
  return colors[index] || '#8c8c8c'
}

onMounted(() => {
  // 销售趋势图
  if (salesChartRef.value) {
    salesChart = echarts.init(salesChartRef.value)
    salesChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['销售额', '订单数'] },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
      yAxis: [{ type: 'value', name: '销售额' }, { type: 'value', name: '订单数' }],
      series: [
        { name: '销售额', type: 'bar', data: [18203, 23489, 29034, 24970, 25760, 28650, 25860] },
        { name: '订单数', type: 'line', yAxisIndex: 1, data: [120, 145, 180, 165, 150, 175, 156] }
      ]
    })
  }

  // 用户增长图
  if (userChartRef.value) {
    userChart = echarts.init(userChartRef.value)
    userChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        smooth: true,
        areaStyle: { opacity: 0.3 },
        data: [820, 932, 1201, 1434]
      }]
    })
  }

  // 订单状态分布图
  if (orderChartRef.value) {
    orderChart = echarts.init(orderChartRef.value)
    orderChart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 1048, name: '已完成', itemStyle: { color: '#52c41a' } },
          { value: 735, name: '待发货', itemStyle: { color: '#faad14' } },
          { value: 580, name: '配送中', itemStyle: { color: '#1890ff' } },
          { value: 300, name: '已取消', itemStyle: { color: '#f5222d' } }
        ]
      }]
    })
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  salesChart?.dispose()
  userChart?.dispose()
  orderChart?.dispose()
})

const handleResize = () => {
  salesChart?.resize()
  userChart?.resize()
  orderChart?.resize()
}
</script>

<style scoped lang="scss">
.statistics-container {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .rank-number {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-right: 12px;

        &.top {
          background: #f5222d;
          color: #fff;
        }
      }

      .rank-info {
        flex: 1;

        .rank-name {
          font-size: 14px;
          margin-bottom: 4px;
        }
      }

      .rank-sales {
        font-size: 14px;
        color: #8c8c8c;
        margin-left: 12px;
      }
    }
  }
}
</style>
