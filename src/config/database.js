const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'employee_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Function to test database connection
const testConnection = async () => {
  try {
    console.log('🔗 Testing database connection...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection test successful');
    console.log('⏰ Server time:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 PostgreSQL server is not running or not accessible');
      console.error('💡 Check if PostgreSQL service is started');
      console.error('💡 Windows: net start postgresql-x64-14');
      console.error('💡 macOS: brew services start postgresql');
      console.error('💡 Linux: sudo systemctl start postgresql');
    } else if (error.code === '28P01') {
      console.error('💡 Authentication failed - check username/password in .env');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist - run: npm run db:init');
    } else if (error.code === 'ENOTFOUND') {
      console.error('💡 Database host not found - check DB_HOST in .env');
    } else {
      console.error('💡 Error details:', error);
    }
    
    return false;
  }
};

// Function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Executed query', { duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    console.error('Query text:', text);
    throw error;
  }
};

// Function to get a client from the pool (for transactions)
const getClient = async () => {
  return await pool.connect();
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};