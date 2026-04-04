const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (users, generateId) => {
  const router = express.Router();

  // 登录
  router.post('/login', (req, res) => {
    try {
      const { username, password } = req.body;
      
      // 查找用户
      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(401).json({ code: 401, message: '用户名或密码错误' });
      }
      
      // 验证密码（简化版，实际应该使用密码加密）
      if (user.password !== password) {
        return res.status(401).json({ code: 401, message: '用户名或密码错误' });
      }
      
      // 生成token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d'
      });
      
      res.json({ 
        code: 200, 
        message: '登录成功',
        data: {
          token,
          userInfo: {
            id: user.id,
            username: user.username,
            realName: user.realName,
            role: user.role,
            roleName: user.roleName,
            permissions: user.permissions
          }
        }
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 获取用户列表
  router.get('/', (req, res) => {
    try {
      res.json({ 
        code: 200, 
        message: '获取用户列表成功',
        data: users
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 获取用户详情
  router.get('/:id', (req, res) => {
    try {
      const user = users.find(u => u.id === req.params.id);
      if (!user) {
        return res.status(404).json({ code: 404, message: '用户不存在' });
      }
      res.json({ 
        code: 200, 
        message: '获取用户详情成功',
        data: user
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 创建用户
  router.post('/', (req, res) => {
    try {
      const { username, password, realName, role, roleName, permissions } = req.body;
      
      // 检查用户名是否存在
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return res.status(400).json({ code: 400, message: '用户名已存在' });
      }
      
      const user = {
        id: generateId(),
        username,
        password,
        realName,
        role: role || 'user',
        roleName: roleName || '普通用户',
        permissions: permissions || [],
        createdAt: new Date()
      };
      
      users.push(user);
      res.json({ 
        code: 200, 
        message: '创建用户成功',
        data: user
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 更新用户
  router.put('/:id', (req, res) => {
    try {
      const { password, realName, role, roleName, permissions } = req.body;
      
      const userIndex = users.findIndex(u => u.id === req.params.id);
      if (userIndex === -1) {
        return res.status(404).json({ code: 404, message: '用户不存在' });
      }
      
      const user = users[userIndex];
      if (password) user.password = password;
      if (realName) user.realName = realName;
      if (role) user.role = role;
      if (roleName) user.roleName = roleName;
      if (permissions) user.permissions = permissions;
      
      res.json({ 
        code: 200, 
        message: '更新用户成功',
        data: user
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  // 删除用户
  router.delete('/:id', (req, res) => {
    try {
      const userIndex = users.findIndex(u => u.id === req.params.id);
      if (userIndex === -1) {
        return res.status(404).json({ code: 404, message: '用户不存在' });
      }
      
      users.splice(userIndex, 1);
      res.json({ 
        code: 200, 
        message: '删除用户成功'
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  return router;
};