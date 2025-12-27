const express = require('express');
const next = require('next');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const connectDB = require('./config/database');
const authMiddleware = require('./middleware/auth');
const mongoose = require('mongoose');

// Import routes
const resumeRoutes = require('./routes/resumes');
const verificationRoutes = require('./routes/verification');

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: require('path').join(__dirname, '..') });
const handle = nextApp.getRequestHandler();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration - Allow same origin since frontend and backend are on same server
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'https://resumebuilder.ilc.limited'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes (must be before Next.js handler)
app.use('/api/resumes', authMiddleware, resumeRoutes);
app.use('/api/resumes', authMiddleware, verificationRoutes);

// Handle all other routes with Next.js
app.all('*', (req, res) => {
  return handle(req, res);
});

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  // Only handle API errors, let Next.js handle frontend errors
  if (req.path.startsWith('/api')) {
    console.error('API Error:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: err.message
      });
    }
    
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid or expired token'
      });
    }
    
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
  
  // For non-API routes, pass to Next.js error handler
  next(err);
});

// Start server
nextApp.prepare().then(() => {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 API Base: http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`✅ Production mode enabled`);
      console.log(`🔒 Security features: Enabled`);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
}).catch((ex) => {
  console.error('Failed to start server:', ex);
  process.exit(1);
});

module.exports = app;

