// LEO SUSHI Backend Server với hỗ trợ SSL/HTTPS
// Sử dụng file này thay cho server.js khi đã có SSL certificate

const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const config = require('./config/config');

const app = express();

// Middleware
// CORS: Cho phép nhiều origins trong development
const allowedOrigins = [
  config.corsOrigin,
  'http://localhost:5500',
  'http://localhost:8000',
  'https://localhost:5500',
  'https://localhost:8000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:8000',
  'https://127.0.0.1:5500',
  'https://127.0.0.1:8000',
  'file://' // Cho phép file:// protocol (local HTML files)
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (như file://, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('file://')) {
      callback(null, true);
    } else {
      // Trong development, cho phép tất cả
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/menu', require('./routes/menu'));

// SSL Certificate paths
const SSL_CERT_PATH = 'D:/jatodemo/ssl/cert.pem';
const SSL_KEY_PATH = 'D:/jatodemo/ssl/key.pem';

// Check if SSL certificates exist
const hasSSL = fs.existsSync(SSL_CERT_PATH) && fs.existsSync(SSL_KEY_PATH);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LEO SUSHI Backend API is running',
    ssl: hasSSL,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

const PORT = config.port;
const HTTPS_PORT = 3444; // Port khác để tránh conflict

if (hasSSL) {
  try {
    const httpsOptions = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH)
    };
    
    // HTTPS Server
    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
      console.log(`🔒 LEO SUSHI Backend API running on HTTPS port ${HTTPS_PORT}`);
      console.log(`📍 Health check: https://localhost:${HTTPS_PORT}/api/health`);
      console.log(`📍 Health check: https://atmica.ddns.net:${HTTPS_PORT}/api/health`);
    });
    
    // HTTP Server (redirect to HTTPS)
    const httpApp = express();
    httpApp.use((req, res) => {
      const host = req.headers.host.replace(`:${PORT}`, '');
      res.redirect(`https://${host}:${HTTPS_PORT}${req.url}`);
    });
    httpApp.listen(PORT, () => {
      console.log(`HTTP server running on port ${PORT} (redirects to HTTPS)`);
    });
    
  } catch (error) {
    console.error('❌ Error loading SSL certificates:', error.message);
    console.log('⚠️  Falling back to HTTP only...');
    startHttpServer();
  }
} else {
  console.log('⚠️  SSL certificates not found at:');
  console.log(`   - ${SSL_CERT_PATH}`);
  console.log(`   - ${SSL_KEY_PATH}`);
  console.log('⚠️  Running HTTP only. To enable HTTPS:');
  console.log('   1. Run win-acme to get SSL certificate');
  console.log('   2. Copy cert.pem and key.pem to D:/jatodemo/ssl/');
  console.log('   3. Restart server');
  startHttpServer();
}

function startHttpServer() {
  app.listen(PORT, () => {
    console.log(`🚀 LEO SUSHI Backend API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

