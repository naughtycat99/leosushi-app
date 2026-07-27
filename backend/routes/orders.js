// Orders Routes
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { verifyToken } = require('../utils/auth');

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Không có token' 
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token không hợp lệ' 
    });
  }

  req.userId = decoded.userId;
  next();
};

// Save order
router.post('/', authenticate, async (req, res) => {
  try {
    const orderData = req.body;

    if (!orderData.order_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'order_id là bắt buộc' 
      });
    }

    const today = new Date().toISOString().split('T')[0];

    await pool.execute(
      `INSERT INTO orders (
        order_id, customer_id, status, service_type, items, delivery_address,
        summary, customer_code, payment_method, payment_status, paypal_order_id, date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        items = VALUES(items),
        delivery_address = VALUES(delivery_address),
        summary = VALUES(summary),
        payment_method = VALUES(payment_method),
        payment_status = VALUES(payment_status),
        paypal_order_id = VALUES(paypal_order_id),
        updated_at = CURRENT_TIMESTAMP`,
      [
        orderData.order_id,
        req.userId,
        orderData.status || 'pending',
        orderData.service_type || 'delivery',
        JSON.stringify(orderData.items || []),
        JSON.stringify(orderData.delivery?.address || {}),
        JSON.stringify(orderData.summary || {}),
        orderData.customer_code || null,
        orderData.summary?.payment_method || 'paypal',
        orderData.payment_status || 'pending',
        orderData.paypal_order_id || null,
        today
      ]
    );

    res.json({
      success: true,
      message: 'Order saved successfully',
      order_id: orderData.order_id
    });
  } catch (error) {
    console.error('Save order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi lưu order' 
    });
  }
});

// Get order by ID
router.get('/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await pool.execute(
      'SELECT * FROM orders WHERE order_id = ? AND customer_id = ?',
      [orderId, req.userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order không tồn tại' 
      });
    }

    const order = orders[0];
    order.items = JSON.parse(order.items || '[]');
    order.delivery_address = JSON.parse(order.delivery_address || '{}');
    order.summary = JSON.parse(order.summary || '{}');

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi lấy order' 
    });
  }
});

module.exports = router;

