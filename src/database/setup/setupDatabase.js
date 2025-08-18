const { checkPrerequisites } = require('./checkPrerequisites');
const { initializeDatabase } = require('../init/createDatabase');
const { runMigrations } = require('../migrations/runMigrations');

// Complete database setup process
const setupDatabase = async () => {
  try {
    console.log('🚀 Starting complete database setup...\n');
    
    // Step 1: Check prerequisites
    console.log('📋 Step 1: Checking prerequisites');
    const prerequisitesPassed = await checkPrerequisites();
    
    if (!prerequisitesPassed) {
      console.log('⚠️  Prerequisites check failed, but continuing with setup...');
      console.log('💡 Make sure to install PostgreSQL and update your .env file');
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Step 2: Initialize database
    console.log('📋 Step 2: Initializing database');
    try {
      const initSuccess = await initializeDatabase();
      if (!initSuccess) {
        console.log('❌ Database initialization failed.');
        return false;
      }
    } catch (error) {
      console.log('❌ Database initialization failed:', error.message);
      console.log('💡 Please ensure PostgreSQL is installed and running');
      return false;
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Step 3: Run migrations
    console.log('📋 Step 3: Running database migrations');
    try {
      await runMigrations();
    } catch (error) {
      console.log('❌ Migration failed:', error.message);
      return false;
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Database setup completed successfully!');
    console.log('\n📊 Your database is ready with:');
    console.log('   ✅ Employee management table');
    console.log('   ✅ Proper indexes for performance');
    console.log('   ✅ Sample data for testing');
    console.log('   ✅ Data validation constraints');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Start the API server: npm run dev');
    console.log('   2. Test the API: http://localhost:3000/health');
    console.log('   3. View employees: http://localhost:3000/api/employees');
    
    return true;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your .env file configuration');
    console.log('   2. Ensure PostgreSQL is running');
    console.log('   3. Verify database user permissions');
    console.log('   4. Check the logs above for specific errors');
    
    return false;
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  
  setupDatabase()
    .then((success) => {
      console.log(success ? '\n✅ Setup completed successfully!' : '\n❌ Setup failed!');
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal setup error:', error);
      process.exit(1);
    });
}

module.exports = {
  setupDatabase
};