## Database Setup Instructions

## Quick Setup (PostgreSQL Command Line)

### 1. Connect to PostgreSQL
```bash
# Connect as postgres user
psql -U postgres -h localhost

# Or if you have a different user
psql -U your_username -h localhost
```

### 2. Run SQL Files in Order
```sql
-- 1. Create database and user
\i database/01_create_database.sql

-- 2. Create tables and indexes
\i database/02_create_tables.sql

-- 3. Insert sample data
\i database/03_insert_sample_data.sql

-- 4. Verify setup
\i database/04_verify_setup.sql
```

## Alternative: Run Individual Commands

### Step 1: Create Database
```sql
CREATE DATABASE employee_management_db;
\c employee_management_db;
```

### Step 2: Create Table
Copy and paste the contents of `02_create_tables.sql`

### Step 3: Insert Sample Data
Copy and paste the contents of `03_insert_sample_data.sql`

## Troubleshooting

If you're getting internal server errors, run:
```sql
\i database/05_troubleshooting.sql
```

This will help identify:
- Connection issues
- Missing tables
- Permission problems
- Data integrity issues

## Environment Variables

Make sure your `.env` file has:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management_db
DB_USER=postgres
DB_PASSWORD=your_password
```

## Common Issues

### 1. "relation does not exist"
- Run `02_create_tables.sql`
- Check if you're connected to the right database

### 2. "permission denied"
- Make sure your user has proper permissions
- Try connecting as postgres superuser

### 3. "database does not exist"
- Run `01_create_database.sql` first
- Make sure DB_NAME in .env matches created database

### 4. Connection refused
- Check if PostgreSQL service is running
- Verify host and port in .env file

## Verification

After setup, you should see:
- 8 sample employees
- 4 departments (Engineering, Design, Marketing, Sales, HR)
- Various employee types and billing statuses
- Proper indexes and constraints