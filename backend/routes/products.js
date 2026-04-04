const express = require('express');

module.exports = (products, generateId) => {
  const router = express.Router();

  // 获取商品列表
  router.get('/', (req, res) => {
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

  // 获取商品详情
  router.get('/:id', (req, res) => {
    try {
      const product = products.find(p => p.id === req.params.id);
      if (!product) {
        return res.status(404).json({ code: 404, message: '商品不存在' });
      }
      res.json({ 
        code: 200, 
        message: '获取商品详情成功',
        data: product
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 创建商品
  router.post('/', (req, res) => {
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
      res.json({ 
        code: 200, 
        message: '创建商品成功',
        data: product
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 更新商品
  router.put('/:id', (req, res) => {
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
      if (stock) product.stock = stock;
      if (description) product.description = description;
      if (status) product.status = status;
      if (type) product.type = type;
      if (expiryDate) product.expiryDate = new Date(expiryDate);
      product.updatedAt = new Date();
      
      res.json({ 
        code: 200, 
        message: '更新商品成功',
        data: product
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 删除商品
  router.delete('/:id', (req, res) => {
    try {
      const productIndex = products.findIndex(p => p.id === req.params.id);
      if (productIndex === -1) {
        return res.status(404).json({ code: 404, message: '商品不存在' });
      }
      
      products.splice(productIndex, 1);
      res.json({ 
        code: 200, 
        message: '删除商品成功'
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 获取商品分类
  router.get('/categories/list', (req, res) => {
    try {
      const categories = [...new Set(products.map(p => p.category))];
      res.json({ 
        code: 200, 
        message: '获取商品分类成功',
        data: categories
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  return router;
};