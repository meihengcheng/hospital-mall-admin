// 用户相关类型
export interface User {
  id: number
  username: string
  phone: string
  email?: string
  realName?: string
  idCard?: string
  memberLevel: 'normal' | 'silver' | 'gold' | 'vip'
  status: 'active' | 'frozen' | 'banned'
  authStatus: 'pending' | 'approved' | 'rejected'
  createdAt: string
  lastLoginAt?: string
}

// 商品相关类型
export interface Product {
  id: number
  name: string
  category: string
  categoryId: number
  price: number
  stock: number
  safetyStock: number
  status: 'on' | 'off'
  specification: string
  manufacturer: string
  approvalNumber?: string
  expiryDate?: string
  images: string[]
  description?: string
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
  id: number
  orderNo: string
  userId: number
  userName: string
  totalAmount: number
  status: OrderStatus
  deliveryType: 'self' | 'delivery'
  address?: Address
  items: OrderItem[]
  prescription?: Prescription
  createdAt: string
  paidAt?: string
  shippedAt?: string
  completedAt?: string
}

export type OrderStatus = 
  | 'pending' 
  | 'paid' 
  | 'processing' 
  | 'shipped' 
  | 'completed' 
  | 'cancelled' 
  | 'refunding'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  specification: string
  price: number
  quantity: number
  subtotal: number
}

export interface Address {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
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
