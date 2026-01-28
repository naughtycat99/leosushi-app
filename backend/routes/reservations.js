// Reservations Routes
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

// Save reservation
router.post('/', authenticate, async (req, res) => {
  try {
    const reservationData = req.body;

    if (!reservationData.reservation_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'reservation_id là bắt buộc' 
      });
    }

    await pool.execute(
      `INSERT INTO reservations (
        reservation_id, customer_id, first_name, last_name, phone, email,
        date, time, guests, table_number, note, items, customer_code, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        phone = VALUES(phone),
        email = VALUES(email),
        date = VALUES(date),
        time = VALUES(time),
        guests = VALUES(guests),
        table_number = VALUES(table_number),
        note = VALUES(note),
        items = VALUES(items),
        status = VALUES(status),
        updated_at = CURRENT_TIMESTAMP`,
      [
        reservationData.reservation_id,
        req.userId,
        reservationData.first_name || reservationData.firstName,
        reservationData.last_name || reservationData.lastName,
        reservationData.phone,
        reservationData.email,
        reservationData.date,
        reservationData.time,
        reservationData.guests,
        reservationData.table_number || reservationData.tableNumber || null,
        reservationData.note || null,
        JSON.stringify(reservationData.items || []),
        reservationData.customer_code || null,
        reservationData.status || 'pending'
      ]
    );

    res.json({
      success: true,
      message: 'Reservation saved successfully',
      reservation_id: reservationData.reservation_id
    });
  } catch (error) {
    console.error('Save reservation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi lưu reservation' 
    });
  }
});

// Get reservation by ID
router.get('/:reservationId', authenticate, async (req, res) => {
  try {
    const { reservationId } = req.params;

    const [reservations] = await pool.execute(
      'SELECT * FROM reservations WHERE reservation_id = ? AND customer_id = ?',
      [reservationId, req.userId]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Reservation không tồn tại' 
      });
    }

    const reservation = reservations[0];
    reservation.items = JSON.parse(reservation.items || '[]');

    res.json({
      success: true,
      reservation
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi lấy reservation' 
    });
  }
});

module.exports = router;

