# Local Setup Instructions for Employee Management API

## 🚀 Quick Setup Guide

Since Git is not available in the WebContainer environment, follow these steps to set up the repository on your local machine.

## Step 1: Download Project Files

1. **Download all files** from this WebContainer environment to your local machine
2. **Create a new folder** for your project (e.g., `employee-management-api`)
3. **Copy all files** into this folder

## Step 2: Initialize Git Repository Locally

Open terminal/command prompt in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Employee Management API with PostgreSQL"

# Add your remote repository
git remote add origin https://github.com/karuna-project-space/PMtool.git

# Create main branch and push
git branch -M main
git push -u origin main
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

## Step 5: Install and Setup PostgreSQL

### Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer and remember the postgres user password
3. Start PostgreSQL service

### macOS:
```bash
brew install postgresql
brew services start postgresql
```

### Linux:
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 6: Setup Database

```bash
# Run complete database setup
npm run db:setup
```

Or manually:
```bash
# Check prerequisites
npm run db:check

# Initialize database
npm run db:init

# Run migrations
npm run migrate
```

## Step 7: Start the Server

```bash
npm run dev
```

## Step 8: Test the API

Visit these URLs to verify everything works:
- Health Check: http://localhost:3000/health
- All Employees: http://localhost:3000/api/employees
- Dashboard: http://localhost:3000/api/dashboard/overview

## 🎉 You're Ready!

Your Employee Management API is now running locally and pushed to GitHub!

## Next Steps:
1. **Frontend Integration**: Connect your React/Vue/Angular frontend
2. **Team Collaboration**: Share the repository with your team
3. **Production Deployment**: Follow DEPLOYMENT.md for production setup

## Troubleshooting:

If you encounter issues:
1. Check PostgreSQL is installed and running
2. Verify .env file has correct database credentials
3. Ensure all dependencies are installed with `npm install`
4. Check the SETUP.md file for detailed troubleshooting

## Repository Structure:
```
employee-management-api/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # API controllers
│   ├── database/        # Database setup and migrations
│   ├── middleware/      # Validation and error handling
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   └── utils/           # Helper utilities
├── supabase/migrations/ # Database migrations
├── server.js           # Main application entry
├── package.json        # Dependencies and scripts
├── README.md           # Project documentation
├── SETUP.md            # Setup instructions
└── .env               # Environment variables
```