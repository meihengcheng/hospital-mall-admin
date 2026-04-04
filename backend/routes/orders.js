const express = require('express');

module.exports = (orders, generateId, generateOrderNo) => {
  const router = express.Router();

  // 获取订单列表
  router.get('/', (req, res) => {
    try {
      const { page = 1, limit = 10, status, paymentStatus } = req.query;
      
      let filteredOrders = [...orders];
      if (status) {
        filteredOrders = filteredOrders.filter(o => o.status === status);
      }
      if (paymentStatus) {
        filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentStatus);
      }
      
      // 按创建时间倒序排序
      filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
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

  // 获取订单详情
  router.get('/:id', (req, res) => {
    try {
      const order = orders.find(o => o.id === req.params.id);
      if (!order) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
      }
      res.json({ 
        code: 200, 
        message: '获取订单详情成功',
        data: order
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 创建订单
  router.post('/', (req, res) => {
    try {
      const { userId, products, totalAmount, shippingAddress, contactPhone } = req.body;
      
      const order = {
        id: generateId(),
        orderNo: generateOrderNo(),
        userId,
        products,
        totalAmount,
        status: 'pending',
        paymentStatus: 'unpaid',
        shippingAddress: shippingAddress || '',
        contactPhone: contactPhone || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      orders.push(order);
      res.json({ 
        code: 200, 
        message: '创建订单成功',
        data: order
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 更新订单状态
  router.put('/:id/status', (req, res) => {
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
      
      res.json({ 
        code: 200, 
        message: '更新订单状态成功',
        data: order
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 删除订单
  router.delete('/:id', (req, res) => {
    try {
      const orderIndex = orders.findIndex(o => o.id === req.params.id);
      if (orderIndex === -1) {
        return res.status(404).json({ code: 404, message: '订单不存在' });
      }
      
      orders.splice(orderIndex, 1);
      res.json({ 
        code: 200, 
        message: '删除订单成功'
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  return router;
};