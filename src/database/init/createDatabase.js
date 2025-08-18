const { Client } = require('pg');
require('dotenv').config();

// Database initialization configuration
const initConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // Don't specify database for initial connection
};

const targetDatabase = process.env.DB_NAME || 'employee_management';

// Function to create database if it doesn't exist
const createDatabase = async () => {
  const client = new Client(initConfig);
  
  try {
    console.log('🔗 Connecting to PostgreSQL server...');
    await client.connect();
    
    // Check if database exists
    const checkDbQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    
    const result = await client.query(checkDbQuery, [targetDatabase]);
    
    if (result.rows.length === 0) {
      console.log(`📦 Creating database: ${targetDatabase}`);
      
      // Create database (cannot use parameterized query for database name)
      await client.query(`CREATE DATABASE "${targetDatabase}"`);
      console.log(`✅ Database '${targetDatabase}' created successfully`);
    } else {
      console.log(`✅ Database '${targetDatabase}' already exists`);
    }
    
  } catch (error) {
    console.error('❌ Database creation error:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure PostgreSQL server is running');
      console.error('💡 Check your connection settings in .env file');
      console.error('💡 Install PostgreSQL: https://www.postgresql.org/download/');
    } else if (error.code === '28P01') {
      console.error('💡 Check your database credentials in .env file');
    } else if (error.code === '3D000') {
      console.error('💡 Default database connection issue - this is normal for initial setup');
    } else if (error.code === 'ENOTFOUND') {
      console.error('💡 Cannot find database host - check DB_HOST in .env');
    }
    
    throw error;
  } finally {
    await client.end();
  }
};

// Function to test database connection after creation
const testDatabaseConnection = async () => {
  const testClient = new Client({
    ...initConfig,
    database: targetDatabase
  });
  
  try {
    console.log('🧪 Testing database connection...');
    await testClient.connect();
    
    const result = await testClient.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Database connection successful');
    console.log(`⏰ Current time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  } finally {
    await testClient.end();
  }
};

// Main initialization function
const initializeDatabase = async () => {
  try {
    console.log('🚀 Starting database initialization...');
    console.log(`📋 Target database: ${targetDatabase}`);
    console.log(`🏠 Host: ${initConfig.host}:${initConfig.port}`);
    console.log(`👤 User: ${initConfig.user}`);
    
    await createDatabase();
    const connectionSuccess = await testDatabaseConnection();
    
    if (connectionSuccess) {
      console.log('🎉 Database initialization completed successfully!');
      console.log('💡 Next steps:');
      console.log('   1. Run: npm run migrate');
      console.log('   2. Run: npm run dev');
      return true;
    } else {
      throw new Error('Database connection test failed');
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Ensure PostgreSQL is installed and running');
    console.log('2. Check your .env file configuration');
    console.log('3. Verify database user has CREATE DATABASE privileges');
    console.log('4. Try connecting manually: psql -h localhost -U postgres');
    return false;
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = {
  initializeDatabase,
  createDatabase,
  testDatabaseConnection
};