const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const users = [
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
  },
  {
    id: '3',
    username: 'user2',
    password: '123456',
    realName: '李四',
    role: 'user',
    roleName: '普通用户',
    permissions: ['read'],
    createdAt: new Date()
  },
  {
    id: '4',
    username: 'user3',
    password: '123456',
    realName: '王五',
    role: 'user',
    roleName: '普通用户',
    permissions: ['read'],
    createdAt: new Date()
  },
  {
    id: '5',
    username: 'user4',
    password: '123456',
    realName: '赵六',
    role: 'user',
    roleName: '普通用户',
    permissions: ['read'],
    createdAt: new Date()
  },
  {
    id: '6',
    username: 'user5',
    password: '123456',
    realName: '孙七',
    role: 'user',
    roleName: '普通用户',
    permissions: ['read'],
    createdAt: new Date()
  },
  {
    id: '7',
    username: 'user6',
    password: '123456',
    realName: '周八',
    role: 'user',
    roleName: '普通用户',
    permissions: ['read'],
    createdAt: new Date()
  },
  {
    id: '8',
    username: 'user7',
    password: '123456',
    realName: '吴九',
    role: 'user',
    roleName: '普通用户',
    permissions: ['read'],
    createdAt: new Date()
  }
];

const products = [
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
];

const orders = [
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
  },
  {
    id: '5',
    orderNo: 'ORD202604040005',
    userId: '5',
    products: [
      {
        productId: '5',
        name: '电子血压计',
        quantity: 1,
        price: 298.0
      }
    ],
    totalAmount: 298.0,
    status: 'pending',
    paymentStatus: 'unpaid',
    shippingAddress: '福建省莆田市城厢区文献路321号',
    contactPhone: '13500135000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    orderNo: 'ORD202604040006',
    userId: '6',
    products: [
      {
        productId: '6',
        name: '维生素C片',
        quantity: 3,
        price: 28.0
      }
    ],
    totalAmount: 84.0,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: '福建省宁德市蕉城区蕉城北路654号',
    contactPhone: '13400134000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    orderNo: 'ORD202604040007',
    userId: '7',
    products: [
      {
        productId: '7',
        name: '创可贴',
        quantity: 5,
        price: 5.5
      }
    ],
    totalAmount: 27.5,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: '福建省龙岩市新罗区九一南路987号',
    contactPhone: '13300133000',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    orderNo: 'ORD202604040008',
    userId: '8',
    products: [
      {
        productId: '8',
        name: '体温计',
        quantity: 2,
        price: 15.0
      }
    ],
    totalAmount: 30.0,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: '福建省三明市梅列区列东街654号',
    contactPhone: '13200132000',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const categories = [
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
];

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const generateOrderNo = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD${timestamp}${random.toString().padStart(4, '0')}`;
};

const buildCategoryTree = (list) => {
  const tree = [];
  const map = {};
  
  list.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });
  
  list.forEach(item => {
    if (item.parentId) {
      if (map[item.parentId]) {
        map[item.parentId].children.push(map[item.id]);
      }
    } else {
      tree.push(map[item.id]);
    }
  });
  
  return tree.sort((a, b) => a.sort - b.sort);
};

app.get('/users', (req, res) => {
  res.json({ code: 200, message: '获取用户列表成功', data: users });
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ code: 200, message: '登录成功', data: { ...user, token: 'mock-token' } });
  } else {
    res.status(401).json({ code: 401, message: '用户名或密码错误' });
  }
});

app.get('/products', (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, type } = req.query;
    
    let filteredProducts = [...products];
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }
    if (type) {
      filteredProducts = filteredProducts.filter(p => p.type === type);
    }
    
    const total = filteredProducts.length;
    const start = (page - 1) * limit;
    const end = start + Number(limit);
    const paginatedProducts = filteredProducts.slice(start, end);
    
    res.json({ 
      code: 200, 
      message: '获取商品列表成功',
      data: {
        list: paginatedProducts,
        total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.get('/products/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ code: 404, message: '商品不存在' });
    }
    res.json({ code: 200, message: '获取商品详情成功', data: product });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.post('/products', (req, res) => {
  try {
    const { name, category, price, stock, description, status, type, expiryDate } = req.body;
    
    const product = {
      id: generateId(),
      name,
      category,
      price,
      stock: stock || 0,
      description: description || '',
      status: status || 'active',
      type: type || 'general',
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    products.push(product);
    res.json({ code: 200, message: '创建商品成功', data: product });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.put('/products/:id', (req, res) => {
  try {
    const { name, category, price, stock, description, status, type, expiryDate } = req.body;
    
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ code: 404, message: '商品不存在' });
    }
    
    const product = products[productIndex];
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (description) product.description = description;
    if (status) product.status = status;
    if (type) product.type = type;
    if (expiryDate) product.expiryDate = new Date(expiryDate);
    product.updatedAt = new Date();
    
    res.json({ code: 200, message: '更新商品成功', data: product });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.delete('/products/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ code: 404, message: '商品不存在' });
    }
    
    products.splice(productIndex, 1);
    res.json({ code: 200, message: '删除商品成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.get('/products/categories/list', (req, res) => {
  try {
    const cats = [...new Set(products.map(p => p.category))];
    res.json({ code: 200, message: '获取商品分类成功', data: cats });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.get('/orders', (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filteredOrders = [...orders];
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status);
    }
    
    const total = filteredOrders.length;
    const start = (page - 1) * limit;
    const end = start + Number(limit);
    const paginatedOrders = filteredOrders.slice(start, end);
    
    res.json({ 
      code: 200, 
      message: '获取订单列表成功',
      data: {
        list: paginatedOrders,
        total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.get('/orders/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    res.json({ code: 200, message: '获取订单详情成功', data: order });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.put('/orders/:id/status', (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    
    const order = orders[orderIndex];
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();
    
    res.json({ code: 200, message: '更新订单状态成功', data: order });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.get('/categories', (req, res) => {
  try {
    const tree = buildCategoryTree(categories);
    res.json({ code: 200, message: '获取分类列表成功', data: tree });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.get('/categories/flat', (req, res) => {
  try {
    res.json({ code: 200, message: '获取分类列表成功', data: categories });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.post('/categories', (req, res) => {
  try {
    const { name, parentId, sort, status } = req.body;
    
    const category = {
      id: generateId(),
      name,
      parentId: parentId || null,
      level: parentId ? 2 : 1,
      sort: sort || 0,
      status: status || 'on',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    categories.push(category);
    res.json({ code: 200, message: '创建分类成功', data: category });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.put('/categories/:id', (req, res) => {
  try {
    const { name, parentId, sort, status } = req.body;
    
    const categoryIndex = categories.findIndex(c => c.id === req.params.id);
    if (categoryIndex === -1) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }
    
    const category = categories[categoryIndex];
    if (name) category.name = name;
    if (parentId !== undefined) {
      category.parentId = parentId;
      category.level = parentId ? 2 : 1;
    }
    if (sort !== undefined) category.sort = sort;
    if (status) category.status = status;
    category.updatedAt = new Date();
    
    res.json({ code: 200, message: '更新分类成功', data: category });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.delete('/categories/:id', (req, res) => {
  try {
    const categoryIndex = categories.findIndex(c => c.id === req.params.id);
    if (categoryIndex === -1) {
      return res.status(404).json({ code: 404, message: '分类不存在' });
    }
    
    const hasChildren = categories.some(c => c.parentId === req.params.id);
    if (hasChildren) {
      return res.status(400).json({ code: 400, message: '该分类下有子分类，无法删除' });
    }
    
    categories.splice(categoryIndex, 1);
    res.json({ code: 200, message: '删除分类成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

module.exports = (req, res) => {
  app(req, res);
};
