# Troubleshooting Guide

## Internal Server Error - Common Causes and Solutions

### 1. Database Connection Issues

#### Symptoms:
- "Internal server error" when starting the API
- "Connection refused" errors
- "Database does not exist" errors

#### Solutions:

**Check PostgreSQL Service:**
```bash
# Windows
net start postgresql-x64-14

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
sudo systemctl status postgresql
```

**Verify Database Exists:**
```bash
psql -U postgres -l
```

**Create Database if Missing:**
```sql
psql -U postgres
CREATE DATABASE employee_management_db;
\q
```

### 2. Environment Variables

#### Check your `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management_db
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

#### Test Connection:
```bash
psql -h localhost -p 5432 -U postgres -d employee_management_db
```

### 3. Missing Tables

#### Symptoms:
- "relation 'employees' does not exist"
- API endpoints return 500 errors

#### Solution:
Run the database setup SQL files:
```bash
# Connect to your database
psql -U postgres -d employee_management_db

# Run table creation
\i database/create_tables.sql

# Insert sample data
\i database/insert_sample_data.sql

# Verify setup
\i database/verify_setup.sql
```

### 4. Permission Issues

#### Symptoms:
- "permission denied for table employees"
- Authentication failures

#### Solutions:
```sql
-- Grant permissions to your user
GRANT ALL PRIVILEGES ON DATABASE employee_management_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

### 5. Port Conflicts

#### Symptoms:
- "Port 3000 already in use"
- Server won't start

#### Solutions:
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### 6. Node.js Issues

#### Clear npm cache:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

#### Check Node.js version:
```bash
node --version  # Should be 14+ 
npm --version
```

### 7. Database Migration Issues

#### Reset database:
```sql
DROP DATABASE IF EXISTS employee_management_db;
CREATE DATABASE employee_management_db;
```

Then run setup again:
```bash
npm run db:setup
```

### 8. Debugging Steps

#### Enable detailed logging:
Add to your `.env`:
```env
NODE_ENV=development
DEBUG=*
```

#### Check server logs:
```bash
npm run dev
# Look for specific error messages
```

#### Test database connection:
```bash
node -e "
const { testConnection } = require('./src/config/database');
testConnection().then(result => {
  console.log('Connection test:', result);
  process.exit(0);
}).catch(err => {
  console.error('Connection failed:', err);
  process.exit(1);
});
"
```

### 9. Quick Fix Commands

#### Complete reset:
```bash
# Stop server
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS employee_management_db;"
psql -U postgres -c "CREATE DATABASE employee_management_db;"

# Run setup
psql -U postgres -d employee_management_db -f database/create_tables.sql
psql -U postgres -d employee_management_db -f database/insert_sample_data.sql

# Restart server
npm run dev
```

#### Test API endpoints:
```bash
# Health check
curl http://localhost:3000/health

# Get employees
curl http://localhost:3000/api/employees

# Dashboard
curl http://localhost:3000/api/dashboard/overview
```

### 10. Getting Help

If issues persist:

1. **Check the logs** - Look for specific error messages
2. **Verify prerequisites** - PostgreSQL installed and running
3. **Test manually** - Connect to database with psql
4. **Check permissions** - Ensure user has database access
5. **Review configuration** - Double-check .env file

### Common Error Messages and Solutions:

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Start PostgreSQL service |
| `database "..." does not exist` | Create database |
| `relation "employees" does not exist` | Run create_tables.sql |
| `permission denied` | Grant user permissions |
| `Port 3000 in use` | Kill process or use different port |
| `Cannot find module` | Run npm install |

Your Employee Management API should work perfectly once the database is properly set up! 🚀