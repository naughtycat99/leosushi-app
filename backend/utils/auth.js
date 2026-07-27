// Authentication Utilities
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');

// Generate discount code
function generateDiscountCode() {
  const prefix = 'WELCOME';
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${random}`;
}

// Generate verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare password
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
}

// Generate customer ID from email
function generateCustomerId(email) {
  return Buffer.from(email.toLowerCase().trim()).toString('base64').replace(/[+/=]/g, '');
}

module.exports = {
  generateDiscountCode,
  generateVerificationToken,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateCustomerId
};

