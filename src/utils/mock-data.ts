export const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: '123456',
    realName: '梅恒成(管理员)',
    role: 'admin',
    roleName: '超级管理员',
    permissions: ['*'],
    createdAt: new Date()
  },
  {
    id: '2',
    username: 'user1',
    password: '123456',
    realName: '张三',
    role: 'user',
    roleName: '普通用户',
    permissions: ['read'],
    createdAt: new Date()
  }
]

export const mockProducts = [
  {
    id: '1',
    name: '阿莫西林胶囊',
    category: '抗生素',
    price: 25.5,
    stock: 100,
    description: '用于敏感菌所致的感染',
    status: 'active',
    type: 'prescription',
    expiryDate: new Date('2025-12-31'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: '布洛芬缓释胶囊',
    category: '解热镇痛',
    price: 18.8,
    stock: 200,
    description: '用于缓解轻至中度疼痛',
    status: 'active',
    type: 'general',
    expiryDate: new Date('2025-10-31'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: '盐酸伐地那非片',
    category: '男科用药',
    price: 128.0,
    stock: 50,
    description: '用于勃起功能障碍',
    status: 'active',
    type: 'prescription',
    expiryDate: new Date('2025-08-31'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: '感冒灵颗粒',
    category: '解热镇痛',
    price: 23.5,
    stock: 150,
    description: '用于感冒引起的头痛、发热',
    status: 'active',
    type: 'general',
    expiryDate: new Date('2025-09-30'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: '电子血压计',
    category: '医疗器械',
    price: 298.0,
    stock: 45,
    description: '家用电子血压计，精准测量',
    status: 'active',
    type: 'general',
    expiryDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: '维生素C片',
    category: '保健品',
    price: 28.0,
    stock: 80,
    description: '补充维生素C，增强免疫力',
    status: 'active',
    type: 'general',
    expiryDate: new Date('2025-12-31'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: '创可贴',
    category: '医疗器械',
    price: 5.5,
    stock: 300,
    description: '用于小伤口止血',
    status: 'active',
    type: 'general',
    expiryDate: new Date('2026-06-30'),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    name: '体温计',
    category: '医疗器械',
    price: 15.0,
    stock: 120,
    description: '家用体温计',
    status: 'active',
    type: 'general',
    expiryDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockOrders = [
  {
    id: '1',
    orderNo: 'ORD202604040001',
    userId: '1',
    products: [
      {
        productId: '1',
        name: '阿莫西林胶囊',
        quantity: 2,
        price: 25.5
      }
    ],
    totalAmount: 51.0,
    status: 'pending',
    paymentStatus: 'unpaid',
    shippingAddress: '福建省福州市鼓楼区东街88号',
    contactPhone: '13800138000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    orderNo: 'ORD202604040002',
    userId: '2',
    products: [
      {
        productId: '2',
        name: '布洛芬缓释胶囊',
        quantity: 1,
        price: 18.8
      }
    ],
    totalAmount: 18.8,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: '福建省厦门市思明区湖滨南路123号',
    contactPhone: '13900139000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    orderNo: 'ORD202604040003',
    userId: '3',
    products: [
      {
        productId: '3',
        name: '盐酸伐地那非片',
        quantity: 1,
        price: 128.0
      }
    ],
    totalAmount: 128.0,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: '福建省泉州市丰泽区丰泽街456号',
    contactPhone: '13700137000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    orderNo: 'ORD202604040004',
    userId: '4',
    products: [
      {
        productId: '4',
        name: '感冒灵颗粒',
        quantity: 2,
        price: 23.5
      }
    ],
    totalAmount: 47.0,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: '福建省漳州市芗城区胜利路789号',
    contactPhone: '13600136000',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const mockCategories = [
  {
    id: '1',
    name: '抗生素',
    level: 1,
    sort: 1,
    status: 'on',
    children: []
  },
  {
    id: '2',
    name: '解热镇痛',
    level: 1,
    sort: 2,
    status: 'on',
    children: []
  },
  {
    id: '3',
    name: '男科用药',
    level: 1,
    sort: 3,
    status: 'on',
    children: []
  },
  {
    id: '4',
    name: '医疗器械',
    level: 1,
    sort: 4,
    status: 'on',
    children: []
  },
  {
    id: '5',
    name: '保健品',
    level: 1,
    sort: 5,
    status: 'on',
    children: []
  }
]
