// Menu Management Routes (Categories & Menu Items)
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../utils/auth');

// Middleware to verify token (for protected routes)
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Không có token. Vui lòng đăng nhập.' 
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token không hợp lệ hoặc đã hết hạn' 
    });
  }

  req.userId = decoded.userId;
  next();
};

// ============================================
// CATEGORIES CRUD
// ============================================

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories ORDER BY sort_order ASC, name ASC'
    );
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách danh mục'
    });
  }
});

// Get category by ID
router.get('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE category_id = ?',
      [categoryId]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Danh mục không tồn tại'
      });
    }
    
    res.json({
      success: true,
      data: categories[0]
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh mục'
    });
  }
});

// Create category (Protected)
router.post('/categories', authenticate, async (req, res) => {
  try {
    const { category_id, name, name_en, description, category_subtitle, category_desc, sort_order } = req.body;
    
    if (!category_id || !name) {
      return res.status(400).json({
        success: false,
        message: 'category_id và name là bắt buộc'
      });
    }
    
    await pool.execute(
      `INSERT INTO categories (
        category_id, name, name_en, description, category_subtitle, category_desc, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        name_en || null,
        description || null,
        category_subtitle || null,
        category_desc || null,
        sort_order || 0
      ]
    );
    
    res.json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: { category_id }
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Danh mục đã tồn tại'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo danh mục'
    });
  }
});

// Update category (Protected)
router.put('/categories/:categoryId', authenticate, async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, name_en, description, category_subtitle, category_desc, sort_order } = req.body;
    
    const [result] = await pool.execute(
      `UPDATE categories SET
        name = COALESCE(?, name),
        name_en = COALESCE(?, name_en),
        description = COALESCE(?, description),
        category_subtitle = COALESCE(?, category_subtitle),
        category_desc = COALESCE(?, category_desc),
        sort_order = COALESCE(?, sort_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE category_id = ?`,
      [
        name || null,
        name_en || null,
        description || null,
        category_subtitle || null,
        category_desc || null,
        sort_order !== undefined ? sort_order : null,
        categoryId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Danh mục không tồn tại'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật danh mục'
    });
  }
});

// Delete category (Protected)
router.delete('/categories/:categoryId', authenticate, async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Check if category has menu items
    const [items] = await pool.execute(
      'SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?',
      [categoryId]
    );
    
    if (items[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục có món ăn. Vui lòng xóa hoặc di chuyển các món ăn trước.'
      });
    }
    
    const [result] = await pool.execute(
      'DELETE FROM categories WHERE category_id = ?',
      [categoryId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Danh mục không tồn tại'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa danh mục thành công'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa danh mục'
    });
  }
});

// ============================================
// MENU ITEMS CRUD
// ============================================

// Get all menu items (with optional category filter)
router.get('/items', async (req, res) => {
  try {
    const { category_id, available } = req.query;
    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];
    
    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }
    
    if (available !== undefined) {
      query += ' AND available = ?';
      params.push(available === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY category_id, name ASC';
    
    const [items] = await pool.execute(query, params);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách món ăn'
    });
  }
});

// Get menu item by ID
router.get('/items/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const [items] = await pool.execute(
      'SELECT * FROM menu_items WHERE item_id = ?',
      [itemId]
    );
    
    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Món ăn không tồn tại'
      });
    }
    
    // Get options if has_options is true
    const item = items[0];
    if (item.has_options) {
      const [options] = await pool.execute(
        'SELECT * FROM menu_item_options WHERE menu_item_id = ? ORDER BY display_order ASC',
        [itemId]
      );
      item.options = options;
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy món ăn'
    });
  }
});

// Create menu item (Protected)
router.post('/items', authenticate, async (req, res) => {
  try {
    const {
      item_id, name, name_en, description, description_en, price, category_id,
      image_url, vegetarian, available, has_options, quantity,
      use_bullet_points, spicy, group_title, options
    } = req.body;
    
    if (!item_id || !name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'item_id, name, price và category_id là bắt buộc'
      });
    }
    
    // Check if category exists
    const [categories] = await pool.execute(
      'SELECT category_id FROM categories WHERE category_id = ?',
      [category_id]
    );
    
    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục không tồn tại'
      });
    }
    
    // Insert menu item
    await pool.execute(
      `INSERT INTO menu_items (
        item_id, name, name_en, description, description_en, price, category_id,
        image_url, vegetarian, available, has_options, quantity,
        use_bullet_points, spicy, group_title
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item_id,
        name,
        name_en || null,
        description || null,
        description_en || null,
        price,
        category_id,
        image_url || null,
        vegetarian ? 1 : 0,
        available !== false ? 1 : 0,
        has_options ? 1 : 0,
        quantity || null,
        use_bullet_points ? 1 : 0,
        spicy ? 1 : 0,
        group_title || null
      ]
    );
    
    // Insert options if provided
    if (has_options && options && Array.isArray(options)) {
      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        const optionId = `${item_id}_opt_${i + 1}`;
        
        await pool.execute(
          `INSERT INTO menu_item_options (
            option_id, menu_item_id, name, price, vegetarian, display_order
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            optionId,
            item_id,
            opt.name,
            opt.price,
            opt.vegetarian ? 1 : 0,
            i + 1
          ]
        );
      }
    }
    
    res.json({
      success: true,
      message: 'Tạo món ăn thành công',
      data: { item_id }
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Món ăn đã tồn tại'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo món ăn'
    });
  }
});

// Update menu item (Protected)
router.put('/items/:itemId', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const {
      name, name_en, description, description_en, price, category_id,
      image_url, vegetarian, available, has_options, quantity,
      use_bullet_points, spicy, group_title
    } = req.body;
    
    const [result] = await pool.execute(
      `UPDATE menu_items SET
        name = COALESCE(?, name),
        name_en = COALESCE(?, name_en),
        description = COALESCE(?, description),
        description_en = COALESCE(?, description_en),
        price = COALESCE(?, price),
        category_id = COALESCE(?, category_id),
        image_url = COALESCE(?, image_url),
        vegetarian = COALESCE(?, vegetarian),
        available = COALESCE(?, available),
        has_options = COALESCE(?, has_options),
        quantity = COALESCE(?, quantity),
        use_bullet_points = COALESCE(?, use_bullet_points),
        spicy = COALESCE(?, spicy),
        group_title = COALESCE(?, group_title),
        updated_at = CURRENT_TIMESTAMP
      WHERE item_id = ?`,
      [
        name || null,
        name_en || null,
        description || null,
        description_en || null,
        price || null,
        category_id || null,
        image_url || null,
        vegetarian !== undefined ? (vegetarian ? 1 : 0) : null,
        available !== undefined ? (available ? 1 : 0) : null,
        has_options !== undefined ? (has_options ? 1 : 0) : null,
        quantity || null,
        use_bullet_points !== undefined ? (use_bullet_points ? 1 : 0) : null,
        spicy !== undefined ? (spicy ? 1 : 0) : null,
        group_title || null,
        itemId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Món ăn không tồn tại'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật món ăn thành công'
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật món ăn'
    });
  }
});

// Delete menu item (Protected)
router.delete('/items/:itemId', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Delete options first (cascade will handle this, but explicit is better)
    await pool.execute(
      'DELETE FROM menu_item_options WHERE menu_item_id = ?',
      [itemId]
    );
    
    const [result] = await pool.execute(
      'DELETE FROM menu_items WHERE item_id = ?',
      [itemId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Món ăn không tồn tại'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa món ăn thành công'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa món ăn'
    });
  }
});

// ============================================
// MENU ITEM OPTIONS CRUD
// ============================================

// Get options for a menu item
router.get('/items/:itemId/options', async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const [options] = await pool.execute(
      'SELECT * FROM menu_item_options WHERE menu_item_id = ? ORDER BY display_order ASC',
      [itemId]
    );
    
    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Get options error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy tùy chọn'
    });
  }
});

// Create option (Protected)
router.post('/items/:itemId/options', authenticate, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, price, vegetarian, display_order } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'name và price là bắt buộc'
      });
    }
    
    // Generate option_id
    const optionId = `${itemId}_opt_${Date.now()}`;
    
    await pool.execute(
      `INSERT INTO menu_item_options (
        option_id, menu_item_id, name, price, vegetarian, display_order
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        optionId,
        itemId,
        name,
        price,
        vegetarian ? 1 : 0,
        display_order || 0
      ]
    );
    
    res.json({
      success: true,
      message: 'Tạo tùy chọn thành công',
      data: { option_id: optionId }
    });
  } catch (error) {
    console.error('Create option error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo tùy chọn'
    });
  }
});

// Update option (Protected)
router.put('/options/:optionId', authenticate, async (req, res) => {
  try {
    const { optionId } = req.params;
    const { name, price, vegetarian, display_order } = req.body;
    
    const [result] = await pool.execute(
      `UPDATE menu_item_options SET
        name = COALESCE(?, name),
        price = COALESCE(?, price),
        vegetarian = COALESCE(?, vegetarian),
        display_order = COALESCE(?, display_order)
      WHERE option_id = ?`,
      [
        name || null,
        price || null,
        vegetarian !== undefined ? (vegetarian ? 1 : 0) : null,
        display_order || null,
        optionId
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tùy chọn không tồn tại'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật tùy chọn thành công'
    });
  } catch (error) {
    console.error('Update option error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật tùy chọn'
    });
  }
});

// Delete option (Protected)
router.delete('/options/:optionId', authenticate, async (req, res) => {
  try {
    const { optionId } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM menu_item_options WHERE option_id = ?',
      [optionId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tùy chọn không tồn tại'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa tùy chọn thành công'
    });
  } catch (error) {
    console.error('Delete option error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xóa tùy chọn'
    });
  }
});

module.exports = router;

