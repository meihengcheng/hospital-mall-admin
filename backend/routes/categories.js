const express = require('express');

module.exports = (categories, generateId) => {
  const router = express.Router();

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

  router.get('/', (req, res) => {
    try {
      const tree = buildCategoryTree(categories);
      res.json({ 
        code: 200, 
        message: '获取分类列表成功',
        data: tree
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  router.get('/flat', (req, res) => {
    try {
      res.json({ 
        code: 200, 
        message: '获取分类列表成功',
        data: categories
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  router.post('/', (req, res) => {
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
      res.json({ 
        code: 200, 
        message: '创建分类成功',
        data: category
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  router.put('/:id', (req, res) => {
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
      
      res.json({ 
        code: 200, 
        message: '更新分类成功',
        data: category
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  router.delete('/:id', (req, res) => {
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
      res.json({ 
        code: 200, 
        message: '删除分类成功'
      });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  });

  return router;
};
