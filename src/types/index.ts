// 用户相关类型
export interface User {
  id: string
  username: string
  realName: string
  role: string
  roleName: string
  permissions: string[]
  createdAt: string
}

// 商品相关类型
export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description?: string
  status: 'active' | 'inactive' | 'on' | 'off'
  type?: 'general' | 'prescription'
  expiryDate?: string
  createdAt: string
  updatedAt: string
}

export interface ProductCategory {
  id: number
  name: string
  parentId: number
  level: number
  sort: number
  status: 'on' | 'off'
}

// 订单相关类型
export interface Order {
  id: string
  orderNo: string
  userId: string
  products: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  shippingAddress?: string
  contactPhone?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

// 处方相关类型
export interface Prescription {
  id: number
  prescriptionNo: string
  doctorId: number
  doctorName: string
  patientId: number
  patientName: string
  diagnosis: string
  items: PrescriptionItem[]
  status: 'pending' | 'approved' | 'rejected'
  reviewNote?: string
  createdAt: string
  reviewedAt?: string
}

export interface PrescriptionItem {
  id: number
  productId: number
  productName: string
  specification: string
  dosage: string
  quantity: number
  usage: string
}

// 库存相关类型
export interface Inventory {
  id: number
  productId: number
  productName: string
  warehouseId: number
  warehouseName: string
  quantity: number
  lockedQuantity: number
  availableQuantity: number
  safetyStock: number
  expiryDate?: string
  updatedAt: string
}

export interface InventoryRecord {
  id: number
  productId: number
  productName: string
  type: 'in' | 'out' | 'adjust'
  subtype: string
  quantity: number
  beforeStock: number
  afterStock: number
  operator: string
  remark?: string
  createdAt: string
}

// 会员相关类型
export interface MemberLevel {
  id: number
  name: string
  level: number
  minPoints: number
  discount: number
  benefits: string[]
}

export interface Coupon {
  id: number
  name: string
  type: 'full_reduction' | 'discount'
  value: number
  minAmount: number
  totalCount: number
  usedCount: number
  startTime: string
  endTime: string
  status: 'active' | 'inactive'
}

// 统计数据类型
export interface DashboardStats {
  todaySales: number
  todayOrders: number
  todayUsers: number
  pendingPrescriptions: number
  lowStockProducts: number
  pendingOrders: number
}

export interface SalesChartData {
  dates: string[]
  sales: number[]
  orders: number[]
}

// 系统设置类型
export interface AdminUser {
  id: number
  username: string
  realName: string
  role: string
  department: string
  status: 'active' | 'inactive'
  lastLoginAt?: string
  createdAt: string
}

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  permissions: string[]
}
