// Authentication Routes
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { 
  generateDiscountCode, 
  generateVerificationToken, 
  hashPassword, 
  comparePassword,
  generateToken,
  generateCustomerId
} = require('../utils/auth');
const { sendVerificationEmail, sendThankYouEmail } = require('../utils/email');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, phone, firstName, lastName, street, postal, city, password } = req.body;

    // Validation
    if (!email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email và số điện thoại là bắt buộc' 
      });
    }

    // Generate customer ID
    const customerId = generateCustomerId(email);

    // Check if user already exists
    const [existing] = await pool.execute(
      'SELECT id FROM customers WHERE email = ? OR id = ?',
      [email, customerId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email đã được sử dụng' 
      });
    }

    // Generate discount code and verification token
    const discountCode = generateDiscountCode();
    const verificationToken = generateVerificationToken();
    const passwordHash = password ? await hashPassword(password) : null;

    // Insert new customer
    await pool.execute(
      `INSERT INTO customers (
        id, email, phone, first_name, last_name, street, postal, city,
        discount_code, verification_token, password_hash, email_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId, email, phone, firstName || null, lastName || null,
        street || null, postal || null, city || null,
        discountCode, verificationToken, passwordHash, false
      ]
    );

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify.html?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    await sendVerificationEmail(email, `${firstName || ''} ${lastName || ''}`.trim() || 'Liebe/r Kunde/in', verificationUrl);

    // Generate session token
    const token = generateToken(customerId);

    res.json({
      success: true,
      message: 'Bitte überprüfen Sie Ihr E-Mail-Postfach zur Bestätigung Ihrer E-Mail-Adresse.',
      user: {
        id: customerId,
        email,
        phone,
        firstName: firstName || null,
        lastName: lastName || null,
        emailVerified: false
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi đăng ký. Vui lòng thử lại.' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validation
    if (!email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email và số điện thoại là bắt buộc' 
      });
    }

    const customerId = generateCustomerId(email);

    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM customers WHERE id = ? AND phone = ?',
      [customerId, phone]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc số điện thoại không đúng' 
      });
    }

    const user = users[0];

    // If password is provided, verify it
    if (password && user.password_hash) {
      const isValid = await comparePassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Mật khẩu không đúng' 
        });
      }
    }

    // Generate session token
    const token = generateToken(customerId);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
        emailVerified: user.email_verified,
        discountCode: user.discount_code,
        discountUsed: user.discount_used
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi đăng nhập. Vui lòng thử lại.' 
    });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token và email là bắt buộc' 
      });
    }

    const customerId = generateCustomerId(email);

    // Find user with matching token
    const [users] = await pool.execute(
      'SELECT * FROM customers WHERE id = ? AND verification_token = ?',
      [customerId, token]
    );

    if (users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token không hợp lệ' 
      });
    }

    const user = users[0];

    if (user.email_verified) {
      return res.json({ 
        success: true, 
        message: 'Email đã được xác thực trước đó' 
      });
    }

    // Update email_verified
    await pool.execute(
      'UPDATE customers SET email_verified = TRUE, verification_token = NULL WHERE id = ?',
      [customerId]
    );

    // Send thank you email with discount code
    await sendThankYouEmail(
      user.email,
      `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Liebe/r Kunde/in',
      user.discount_code
    );

    res.json({
      success: true,
      message: 'E-Mail-Adresse erfolgreich bestätigt! Eine E-Mail mit Ihrem Gutscheincode wurde gesendet.'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi xác thực email. Vui lòng thử lại.' 
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không có token' 
      });
    }

    const { verifyToken } = require('../utils/auth');
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ' 
      });
    }

    const [users] = await pool.execute(
      'SELECT * FROM customers WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User không tồn tại' 
      });
    }

    const user = users[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
        street: user.street,
        postal: user.postal,
        city: user.city,
        emailVerified: user.email_verified,
        discountCode: user.discount_code,
        discountUsed: user.discount_used
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi lấy thông tin user' 
    });
  }
});

// Validate discount code
router.post('/validate-discount', async (req, res) => {
  try {
    const { code } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không có token' 
      });
    }

    const { verifyToken } = require('../utils/auth');
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ' 
      });
    }

    // Get user discount code
    const [users] = await pool.execute(
      'SELECT discount_code, discount_used FROM customers WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User không tồn tại' 
      });
    }

    const user = users[0];

    if (!user.discount_code || user.discount_code.toUpperCase() !== code.toUpperCase()) {
      return res.json({ 
        valid: false, 
        message: 'Mã giảm giá không đúng' 
      });
    }

    if (user.discount_used) {
      return res.json({ 
        valid: false, 
        message: 'Mã giảm giá đã được sử dụng' 
      });
    }

    // Discount is 10% (you can change this)
    res.json({
      valid: true,
      discount: 10,
      message: 'Mã giảm giá hợp lệ'
    });
  } catch (error) {
    console.error('Validate discount error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi xác thực mã giảm giá' 
    });
  }
});

// Mark discount code as used
router.post('/mark-discount-used', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Không có token' 
      });
    }

    const { verifyToken } = require('../utils/auth');
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token không hợp lệ' 
      });
    }

    await pool.execute(
      'UPDATE customers SET discount_used = TRUE WHERE id = ?',
      [decoded.userId]
    );

    res.json({
      success: true,
      message: 'Mã giảm giá đã được đánh dấu là đã sử dụng'
    });
  } catch (error) {
    console.error('Mark discount used error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi đánh dấu mã giảm giá' 
    });
  }
});

module.exports = router;

