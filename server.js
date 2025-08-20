const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection } = require('./src/config/database');
const employeeRoutes = require('./src/routes/employeeRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const bulkUploadRoutes = require('./src/routes/bulkUploadRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const pmRoutes = require('./src/routes/pmRoutes');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Employee Management API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bulk-upload', bulkUploadRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/pm', pmRoutes);

// Serve static files for PM dashboard
app.use(express.static('public'));

// PM Dashboard route
app.get('/pm-dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Start server with database connection test
app.listen(PORT, async () => {
  console.log(`🚀 Employee Management API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Employees API: http://localhost:${PORT}/api/employees`);
  
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Please check your configuration.');
  }
});

module.exports = app;