const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Function to check if PostgreSQL is installed
const checkPostgreSQLInstallation = async () => {
  try {
    console.log('🔍 Checking PostgreSQL installation...');
    
    const { stdout } = await execAsync('psql --version');
    const version = stdout.trim();
    console.log(`✅ PostgreSQL found: ${version}`);
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL not found in PATH');
    return false;
  }
};

// Function to check if PostgreSQL service is running
const checkPostgreSQLService = async () => {
  try {
    console.log('🔍 Checking PostgreSQL service status...');
    
    // Try to connect to default PostgreSQL port
    const { exec } = require('child_process');
    
    return new Promise((resolve) => {
      exec('pg_isready -h localhost -p 5432', (error, stdout, stderr) => {
        if (error) {
          console.log('❌ PostgreSQL service is not running or not accessible');
          console.log('💡 Try starting PostgreSQL service:');
          console.log('   - Windows: net start postgresql-x64-14 (or your version)');
          console.log('   - macOS: brew services start postgresql');
          console.log('   - Linux: sudo systemctl start postgresql');
          resolve(false);
        } else {
          console.log('✅ PostgreSQL service is running');
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.log('❌ Could not check PostgreSQL service status');
    return false;
  }
};

// Function to validate environment variables
const validateEnvironmentVariables = () => {
  console.log('🔍 Validating environment variables...');
  
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:', missingVars.join(', '));
    console.log('💡 Please update your .env file with the required variables');
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  console.log(`   - Database: ${process.env.DB_NAME}`);
  console.log(`   - Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`   - User: ${process.env.DB_USER}`);
  
  return true;
};

// Function to provide installation instructions
const provideInstallationInstructions = () => {
  console.log('\n📋 PostgreSQL Installation Instructions:');
  console.log('\n🪟 Windows:');
  console.log('   1. Download from: https://www.postgresql.org/download/windows/');
  console.log('   2. Run the installer and follow the setup wizard');
  console.log('   3. Remember the password you set for the postgres user');
  
  console.log('\n🍎 macOS:');
  console.log('   1. Using Homebrew: brew install postgresql');
  console.log('   2. Start service: brew services start postgresql');
  console.log('   3. Create user: createuser -s postgres');
  
  console.log('\n🐧 Linux (Ubuntu/Debian):');
  console.log('   1. sudo apt update');
  console.log('   2. sudo apt install postgresql postgresql-contrib');
  console.log('   3. sudo systemctl start postgresql');
  console.log('   4. sudo -u postgres createuser --interactive');
  
  console.log('\n🔧 After installation:');
  console.log('   1. Update your .env file with correct credentials');
  console.log('   2. Run: npm run db:init');
  console.log('   3. Run: npm run migrate');
};

// Main prerequisites check function
const checkPrerequisites = async () => {
  console.log('🚀 Checking system prerequisites...\n');
  
  const checks = [
    { name: 'Environment Variables', check: validateEnvironmentVariables },
    { name: 'PostgreSQL Installation', check: checkPostgreSQLInstallation },
    { name: 'PostgreSQL Service', check: checkPostgreSQLService }
  ];
  
  let allPassed = true;
  
  for (const { name, check } of checks) {
    console.log(`\n--- ${name} ---`);
    const passed = await check();
    if (!passed) {
      allPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 All prerequisites met! You can proceed with database setup.');
    console.log('💡 Next step: npm run db:init');
  } else {
    console.log('❌ Some prerequisites are missing.');
    provideInstallationInstructions();
  }
  
  return allPassed;
};

// Run check if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  
  checkPrerequisites()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Error checking prerequisites:', error);
      process.exit(1);
    });
}

module.exports = {
  checkPrerequisites,
  checkPostgreSQLInstallation,
  checkPostgreSQLService,
  validateEnvironmentVariables
};