// LEO SUSHI Backend Server
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
  'http://127.0.0.1:5500',
  'http://127.0.0.1:8000',
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LEO SUSHI Backend API is running',
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

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 LEO SUSHI Backend API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

