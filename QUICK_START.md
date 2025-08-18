# Quick Start Guide - Employee Management API

## 🚀 Get Your API Running in 5 Minutes

### Step 1: Download and Setup Git Repository

1. **Download all files** from this WebContainer to your local machine
2. **Open terminal** in your project folder
3. **Run the setup script:**
   ```bash
   chmod +x git-setup.sh
   ./git-setup.sh
   ```

   Or manually:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Employee Management API with PostgreSQL"
   git remote add origin https://github.com/karuna-project-space/PMtool.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup PostgreSQL Database

#### Option A: Automated Setup
```bash
npm run db:setup
```

#### Option B: Manual Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Run SQL files in order:
\i database/create_database.sql
\i database/create_tables.sql
\i database/insert_sample_data.sql
\i database/verify_setup.sql
```

### Step 4: Configure Environment
Update `.env` file:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### Step 5: Start the Server
```bash
npm run dev
```

### Step 6: Test the API
- Health Check: http://localhost:3000/health
- All Employees: http://localhost:3000/api/employees
- Dashboard: http://localhost:3000/api/dashboard/overview

## 🎉 You're Ready!

Your Employee Management API is now:
- ✅ Live on GitHub
- ✅ Running locally
- ✅ Connected to PostgreSQL
- ✅ Ready for development

## 📊 What You Get:

### Core Features:
- **Employee CRUD** - Complete employee management
- **Dashboard Analytics** - Real-time metrics and insights
- **Bulk Upload** - CSV/JSON file processing
- **Export Functionality** - Data export capabilities
- **Search & Filter** - Advanced employee search
- **Professional APIs** - RESTful endpoints with validation

### Sample Data Included:
- 8 employees across 5 departments
- Various employee types (Full-time, Contract, Part-time)
- Different billing statuses (Billable, Non-billable, Overhead)
- Skills tracking and utilization metrics

### API Endpoints Ready:
- `GET /api/employees` - List employees
- `POST /api/employees` - Add employee
- `GET /api/dashboard/overview` - Dashboard stats
- `POST /api/bulk-upload` - Bulk upload
- `GET /api/employees/export` - Export data

Happy coding! 🚀