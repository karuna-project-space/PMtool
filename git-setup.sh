#!/bin/bash
# Git Setup Script for Employee Management API
# Run this script on your local machine after downloading all files

echo "🚀 Setting up Employee Management API Git Repository..."

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository
echo "📁 Initializing Git repository..."
git init

# Add all files
echo "📋 Adding all files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Employee Management API with PostgreSQL

Features:
- Complete Employee CRUD operations
- Dashboard analytics with real-time metrics
- Bulk upload functionality (CSV/JSON)
- Export capabilities (CSV/JSON)
- PostgreSQL database integration
- Comprehensive documentation
- Database migration system
- Professional error handling

Tech Stack:
- Node.js + Express
- PostgreSQL with proper indexing
- Joi validation
- Multer file uploads
- CSV parsing
- Professional API structure"

# Add remote repository
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/karuna-project-space/PMtool.git

# Create main branch and push
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully pushed Employee Management API to GitHub!"
echo "🔗 Repository: https://github.com/karuna-project-space/PMtool"
echo ""
echo "Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Set up PostgreSQL database"
echo "3. Run database setup: npm run db:setup"
echo "4. Start the server: npm run dev"