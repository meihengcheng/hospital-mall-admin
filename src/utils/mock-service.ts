import { mockUsers, mockProducts, mockOrders, mockCategories } from './mock-data'

let users = [...mockUsers]
let products = [...mockProducts]
let orders = [...mockOrders]
let categories = [...mockCategories]

const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

const generateOrderNo = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `ORD${timestamp}${random.toString().padStart(4, '0')}`
}

const buildCategoryTree = (list: any[]) => {
  const tree: any[] = []
  const map: Record<string, any> = {}
  
  list.forEach(item => {
    map[item.id] = { ...item, children: [] }
  })
  
  list.forEach(item => {
    if (item.parentId) {
      if (map[item.parentId]) {
        map[item.parentId].children.push(map[item.id])
      }
    } else {
      tree.push(map[item.id])
    }
  })
  
  return tree.sort((a, b) => a.sort - b.sort)
}

export const mockApi = {
  get: (url: string, params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url === '/users') {
          resolve({ code: 200, message: '获取用户列表成功', data: users })
        } else if (url === '/products') {
          const { page = 1, limit = 10, category, status, type } = params || {}
          let filteredProducts = [...products]
          if (category) {
            filteredProducts = filteredProducts.filter(p => p.category === category)
          }
          if (status) {
            filteredProducts = filteredProducts.filter(p => p.status === status)
          }
          if (type) {
            filteredProducts = filteredProducts.filter(p => p.type === type)
          }
          const total = filteredProducts.length
          const start = (page - 1) * limit
          const end = start + Number(limit)
          const paginatedProducts = filteredProducts.slice(start, end)
          resolve({ 
            code: 200, 
            message: '获取商品列表成功',
            data: {
              list: paginatedProducts,
              total,
              page: Number(page),
              limit: Number(limit)
            }
          })
        } else if (url.startsWith('/products/')) {
          const id = url.split('/products/')[1]
          const product = products.find(p => p.id === id)
          if (product) {
            resolve({ code: 200, message: '获取商品详情成功', data: product })
          } else {
            resolve({ code: 404, message: '商品不存在' })
          }
        } else if (url === '/products/categories/list') {
          const cats = [...new Set(products.map(p => p.category))]
          resolve({ code: 200, message: '获取商品分类成功', data: cats })
        } else if (url === '/orders') {
          const { page = 1, limit = 10, status } = params || {}
          let filteredOrders = [...orders]
          if (status) {
            filteredOrders = filteredOrders.filter(o => o.status === status)
          }
          const total = filteredOrders.length
          const start = (page - 1) * limit
          const end = start + Number(limit)
          const paginatedOrders = filteredOrders.slice(start, end)
          resolve({ 
            code: 200, 
            message: '获取订单列表成功',
            data: {
              list: paginatedOrders,
              total,
              page: Number(page),
              limit: Number(limit)
            }
          })
        } else if (url.startsWith('/orders/')) {
          const id = url.split('/orders/')[1]
          const order = orders.find(o => o.id === id)
          if (order) {
            resolve({ code: 200, message: '获取订单详情成功', data: order })
          } else {
            resolve({ code: 404, message: '订单不存在' })
          }
        } else if (url === '/categories') {
          const tree = buildCategoryTree(categories)
          resolve({ code: 200, message: '获取分类列表成功', data: tree })
        } else if (url === '/categories/flat') {
          resolve({ code: 200, message: '获取分类列表成功', data: categories })
        } else if (url === '/health') {
          resolve({ status: 'ok', message: '服务运行正常' })
        } else {
          resolve({ code: 404, message: '接口不存在' })
        }
      }, 200)
    })
  },
  
  post: (url: string, data?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url === '/users/login') {
          const { username, password } = data || {}
          const user = users.find(u => u.username === username && u.password === password)
          if (user) {
            resolve({ code: 200, message: '登录成功', data: { ...user, token: 'mock-token' } })
          } else {
            resolve({ code: 401, message: '用户名或密码错误' })
          }
        } else if (url === '/products') {
          const { name, category, price, stock, description, status, type, expiryDate } = data || {}
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
          }
          products.push(product)
          resolve({ code: 200, message: '创建商品成功', data: product })
        } else if (url === '/categories') {
          const { name, parentId, sort, status } = data || {}
          const category = {
            id: generateId(),
            name,
            parentId: parentId || null,
            level: parentId ? 2 : 1,
            sort: sort || 0,
            status: status || 'on',
            createdAt: new Date(),
            updatedAt: new Date()
          }
          categories.push(category)
          resolve({ code: 200, message: '创建分类成功', data: category })
        } else {
          resolve({ code: 404, message: '接口不存在' })
        }
      }, 200)
    })
  },
  
  put: (url: string, data?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.startsWith('/products/')) {
          const id = url.split('/products/')[1]
          const { name, category, price, stock, description, status, type, expiryDate } = data || {}
          const productIndex = products.findIndex(p => p.id === id)
          if (productIndex !== -1) {
            const product = products[productIndex]
            if (name) product.name = name
            if (category) product.category = category
            if (price) product.price = price
            if (stock !== undefined) product.stock = stock
            if (description) product.description = description
            if (status) product.status = status
            if (type) product.type = type
            if (expiryDate) product.expiryDate = new Date(expiryDate)
            product.updatedAt = new Date()
            resolve({ code: 200, message: '更新商品成功', data: product })
          } else {
            resolve({ code: 404, message: '商品不存在' })
          }
        } else if (url.startsWith('/orders/') && url.endsWith('/status')) {
          const id = url.split('/orders/')[1].split('/status')[0]
          const { status, paymentStatus } = data || {}
          const orderIndex = orders.findIndex(o => o.id === id)
          if (orderIndex !== -1) {
            const order = orders[orderIndex]
            if (status) order.status = status
            if (paymentStatus) order.paymentStatus = paymentStatus
            order.updatedAt = new Date()
            resolve({ code: 200, message: '更新订单状态成功', data: order })
          } else {
            resolve({ code: 404, message: '订单不存在' })
          }
        } else if (url.startsWith('/categories/')) {
          const id = url.split('/categories/')[1]
          const { name, parentId, sort, status } = data || {}
          const categoryIndex = categories.findIndex(c => c.id === id)
          if (categoryIndex !== -1) {
            const category = categories[categoryIndex]
            if (name) category.name = name
            if (parentId !== undefined) {
              category.parentId = parentId
              category.level = parentId ? 2 : 1
            }
            if (sort !== undefined) category.sort = sort
            if (status) category.status = status
            category.updatedAt = new Date()
            resolve({ code: 200, message: '更新分类成功', data: category })
          } else {
            resolve({ code: 404, message: '分类不存在' })
          }
        } else {
          resolve({ code: 404, message: '接口不存在' })
        }
      }, 200)
    })
  },
  
  delete: (url: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.startsWith('/products/')) {
          const id = url.split('/products/')[1]
          const productIndex = products.findIndex(p => p.id === id)
          if (productIndex !== -1) {
            products.splice(productIndex, 1)
            resolve({ code: 200, message: '删除商品成功' })
          } else {
            resolve({ code: 404, message: '商品不存在' })
          }
        } else if (url.startsWith('/categories/')) {
          const id = url.split('/categories/')[1]
          const categoryIndex = categories.findIndex(c => c.id === id)
          if (categoryIndex !== -1) {
            const hasChildren = categories.some(c => c.parentId === id)
            if (hasChildren) {
              resolve({ code: 400, message: '该分类下有子分类，无法删除' })
            } else {
              categories.splice(categoryIndex, 1)
              resolve({ code: 200, message: '删除分类成功' })
            }
          } else {
            resolve({ code: 404, message: '分类不存在' })
          }
        } else {
          resolve({ code: 404, message: '接口不存在' })
        }
      }, 200)
    })
  }
}
