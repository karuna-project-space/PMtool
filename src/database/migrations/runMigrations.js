const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

// Function to run all migration files
const runMigrations = async () => {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Check both locations for migration files
    const localMigrationsDir = __dirname;
    const supabaseMigrationsDir = path.join(__dirname, '../../../supabase/migrations');
    
    let migrationFiles = [];
    
    // Check local migrations directory
    if (fs.existsSync(localMigrationsDir)) {
      const localFiles = fs.readdirSync(localMigrationsDir)
        .filter(file => file.endsWith('.sql'))
        .map(file => ({ file, dir: localMigrationsDir }));
      migrationFiles.push(...localFiles);
    }
    
    // Check supabase migrations directory
    if (fs.existsSync(supabaseMigrationsDir)) {
      const supabaseFiles = fs.readdirSync(supabaseMigrationsDir)
        .filter(file => file.endsWith('.sql'))
        .map(file => ({ file, dir: supabaseMigrationsDir }));
      migrationFiles.push(...supabaseFiles);
    }
    
    // Sort migrations by filename to ensure proper order
    migrationFiles.sort((a, b) => a.file.localeCompare(b.file));

    if (migrationFiles.length === 0) {
      console.log('📄 No migration files found');
      return;
    }
    
    for (const { file, dir } of migrationFiles) {
      console.log(`📄 Running migration: ${file}`);
      
      const filePath = path.join(dir, file);
      const migrationSQL = fs.readFileSync(filePath, 'utf8');
      
      try {
        // Execute the entire migration file as one transaction
        await query(migrationSQL);
        console.log(`✅ Migration completed: ${file}`);
      } catch (error) {
        console.error(`❌ Migration failed: ${file}`, error.message);
        throw error;
      }
    }
    
    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration error:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };