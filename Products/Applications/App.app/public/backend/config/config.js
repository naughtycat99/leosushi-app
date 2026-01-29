// Application Configuration
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  sessionExpiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  resendApiKey: process.env.RESEND_API_KEY || 're_8aXQa5oi_JiyPDjdJDavvEREThCnFzkDZ',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5500',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5500'
};

