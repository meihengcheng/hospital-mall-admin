import dayjs from 'dayjs'

// 格式化日期
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

// 格式化金额
export const formatMoney = (amount: number, prefix = '¥') => {
  if (amount === undefined || amount === null) return '-'
  return `${prefix}${amount.toFixed(2)}`
}

// 格式化数字（千分位）
export const formatNumber = (num: number) => {
  if (num === undefined || num === null) return '-'
  return num.toLocaleString('zh-CN')
}

// 格式化状态
export const formatStatus = (status: string, type: 'order' | 'user' | 'product' | 'prescription') => {
  const statusMap: Record<string, Record<string, { text: string; type: 'success' | 'warning' | 'danger' | 'info' }>> = {
    order: {
      pending: { text: '待支付', type: 'warning' },
      paid: { text: '已支付', type: 'success' },
      processing: { text: '处理中', type: 'info' },
      shipped: { text: '已发货', type: 'success' },
      completed: { text: '已完成', type: 'success' },
      cancelled: { text: '已取消', type: 'danger' },
      refunding: { text: '退款中', type: 'warning' }
    },
    user: {
      active: { text: '正常', type: 'success' },
      frozen: { text: '冻结', type: 'warning' },
      banned: { text: '封禁', type: 'danger' }
    },
    product: {
      on: { text: '上架', type: 'success' },
      off: { text: '下架', type: 'info' }
    },
    prescription: {
      pending: { text: '待审核', type: 'warning' },
      approved: { text: '已通过', type: 'success' },
      rejected: { text: '已拒绝', type: 'danger' }
    }
  }
  
  return statusMap[type]?.[status] || { text: status, type: 'info' }
}

// 格式化会员等级
export const formatMemberLevel = (level: string) => {
  const levelMap: Record<string, string> = {
    normal: '普通会员',
    silver: '银卡会员',
    gold: '金卡会员',
    vip: 'VIP会员'
  }
  return levelMap[level] || level
}
