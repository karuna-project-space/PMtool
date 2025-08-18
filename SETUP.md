# Employee Management API - Setup Guide

## Quick Start (If you have PostgreSQL installed)

If PostgreSQL is already installed and running:

```bash
# 1. Update .env file with your PostgreSQL credentials
# 2. Run complete setup
npm run db:setup
# 3. Start the server
npm run dev
```

## Step-by-Step Setup (First Time)

## Complete Setup Process

Follow these steps to get your Employee Management API up and running with PostgreSQL.

### 0. Install PostgreSQL First

**You must install PostgreSQL before proceeding:**

#### Windows
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. **Remember the password you set for the postgres user**
4. Make sure PostgreSQL service is running

#### macOS
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create postgres user (if needed)
createuser -s postgres
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

### 1. Prerequisites Check

First, let's check if your system has everything needed:

```bash
npm run db:check
```

This will verify:
- ✅ Environment variables are configured
- ✅ PostgreSQL is installed
- ✅ PostgreSQL service is running

### 2. Environment Configuration

Create or update your `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management
DB_USER=postgres
DB_PASSWORD=your_password_here
```

**Important**: Replace `your_password_here` with your actual PostgreSQL password.

### 3. Database Setup

Run the complete database setup:

```bash
npm run db:setup
```

This automated process will:
1. 🔍 Check all prerequisites
2. 📦 Create the database if it doesn't exist
3. 🏗️ Run database migrations
4. 📊 Insert sample employee data
5. ✅ Verify everything is working

### 4. Start the API Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Test the API

Visit these URLs to verify everything is working:

- **Health Check**: http://localhost:3000/health
- **All Employees**: http://localhost:3000/api/employees
- **Sample Employee**: http://localhost:3000/api/employees/[employee-id]

## Manual Setup (If Automated Setup Fails)

### Step 1: Install PostgreSQL

#### Windows
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer and follow the wizard
3. Remember the password for the `postgres` user

#### macOS
```bash
brew install postgresql
brew services start postgresql
createuser -s postgres  # Create postgres user
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createuser --interactive
```

### Step 2: Create Database User (if needed)

Connect to PostgreSQL and create a user:

```sql
-- Connect as postgres user
psql -U postgres

-- Create user with database creation privileges
CREATE USER your_username WITH PASSWORD 'your_password';
ALTER USER your_username CREATEDB;

-- Exit
\q
```

### Step 3: Manual Database Creation

```bash
# Initialize database
npm run db:init

# Run migrations
npm run migrate
```

## Troubleshooting

### Common Issues

#### 1. "PostgreSQL not found"
- **Solution**: Install PostgreSQL using the instructions above
- **Verify**: Run `psql --version` in terminal

#### 2. "Connection refused"
- **Solution**: Start PostgreSQL service
- **Windows**: `net start postgresql-x64-14`
- **macOS**: `brew services start postgresql`
- **Linux**: `sudo systemctl start postgresql`

#### 3. "Authentication failed"
- **Solution**: Check username/password in `.env` file
- **Verify**: Try connecting manually: `psql -h localhost -U your_username -d postgres`

#### 4. "Database does not exist"
- **Solution**: Run `npm run db:init` to create the database
- **Alternative**: Create manually: `createdb employee_management`

#### 5. "Permission denied"
- **Solution**: Ensure user has CREATEDB privileges
- **Fix**: `ALTER USER your_username CREATEDB;`

### Getting Help

If you encounter issues:

1. **Check the logs**: The setup scripts provide detailed error messages
2. **Verify credentials**: Ensure your `.env` file has correct database credentials
3. **Test connection**: Use `psql` to connect manually and verify access
4. **Check service**: Ensure PostgreSQL service is running

### Sample Data

After successful setup, your database will contain sample employees:

- **Engineering Department**: Senior Software Developer
- **Design Department**: UX Designer  
- **Marketing Department**: Digital Marketing Specialist

You can view this data at: http://localhost:3000/api/employees

## Next Steps

Once setup is complete:

1. **Explore the API**: Check out all available endpoints in the README.md
2. **Test with Postman**: Import the API endpoints for testing
3. **Connect your frontend**: Use the API endpoints in your React/Vue/Angular app
4. **Customize**: Modify the employee schema to match your specific needs

## API Endpoints Quick Reference

- `GET /api/employees` - List all employees
- `POST /api/employees` - Add new employee
- `GET /api/employees/:id` - Get specific employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/search/:term` - Search employees
- `GET /api/employees/filters/:type` - Get filter options

Happy coding! 🚀