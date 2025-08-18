# Employee Management API

A comprehensive Node.js REST API for managing employee data with PostgreSQL database, featuring organizational information, professional details, and skills tracking.

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/karuna-project-space/PMtool.git
   cd PMtool
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup database:**
   ```bash
   npm run db:setup
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Test the API:**
   - Health: http://localhost:3000/health
   - Employees: http://localhost:3000/api/employees
   - Dashboard: http://localhost:3000/api/dashboard/overview

## Features

- **Complete Employee Management**: Add, update, view, and delete employees
- **Advanced Filtering**: Filter employees by department, type, location, and more
- **Search Functionality**: Search employees by role, department, location, or skills
- **Data Validation**: Comprehensive input validation using Joi
- **Pagination Support**: Efficient data retrieval with pagination
- **Report Generation**: Generate comprehensive HR analytics reports in PDF and Excel formats
- **PostgreSQL Database**: Robust data persistence with proper indexing
- **Database Migrations**: Automated database schema management
- **Security**: Helmet.js for security headers and CORS configuration
- **Error Handling**: Structured error responses with proper HTTP status codes

## API Endpoints

### Report Generation

#### GET /api/reports/types
Get available report types and their descriptions.

#### GET /api/reports/preview
Get a preview of report data without generating the actual file.

**Query Parameters:**
- `reportType` (optional): Type of report - 'comprehensive', 'utilization', 'department', 'bench', 'skills', 'billing' (default: comprehensive)
- `dateRange` (optional): Analysis period in days (default: 30)

#### GET /api/reports/generate
Generate comprehensive HR analytics report.

**Query Parameters:**
- `format` (optional): Report format - 'pdf' or 'excel' (default: pdf)
- `reportType` (optional): Type of report (default: comprehensive)
- `dateRange` (optional): Analysis period in days (default: 30)
- `includeCharts` (optional): Include charts in PDF reports (default: true)
- `departments` (optional): Filter by specific departments
- `locations` (optional): Filter by specific locations

#### GET /api/reports/generate/:reportType
Generate specific type of report.

**Path Parameters:**
- `reportType`: Type of report - 'utilization', 'department', 'bench', 'skills', 'billing'

**Query Parameters:**
- `format` (optional): Report format - 'pdf' or 'excel' (default: pdf)
- `dateRange` (optional): Analysis period in days (default: 30)

### Bulk Upload Operations

#### POST /api/bulk-upload
Upload and process multiple employees via CSV or JSON file.

**Form Data:**
- `file`: CSV or JSON file containing employee data

**Response includes:**
- Total records processed
- Number of successful/failed records
- Detailed error information for failed records
- List of successfully created employees

#### POST /api/bulk-upload/validate
Validate uploaded file without processing (preview mode).

**Form Data:**
- `file`: CSV or JSON file to validate

**Response includes:**
- File validation results
- Preview of first 5 records
- Validation errors for preview records

#### GET /api/bulk-upload/template
Download template file for bulk upload.

**Query Parameters:**
- `format` (optional): Template format - 'csv' or 'json' (default: csv)

#### GET /api/bulk-upload/history
Get bulk upload history and statistics.

### Dashboard Operations

#### GET /api/dashboard/overview
Get dashboard overview statistics including total employees, full-time staff, consultants, billable employees, bench employees, and average utilization.

#### GET /api/dashboard/analytics
Get employee analytics by department with counts, utilization, and hourly rates.

#### GET /api/dashboard/utilization
Get utilization metrics and distribution.

**Query Parameters:**
- `period` (optional): Analysis period in days (default: 30)

#### GET /api/dashboard/departments
Get department-wise breakdown with employee counts, billing status, and utilization rates.

#### GET /api/dashboard/skills
Get skills distribution across employees.

**Query Parameters:**
- `limit` (optional): Number of top skills to return (default: 10)

#### GET /api/dashboard/activities
Get recent employee activities (additions, updates).

**Query Parameters:**
- `limit` (optional): Number of recent activities (default: 10)

#### GET /api/dashboard/locations
Get location-wise employee distribution with utilization metrics.

#### GET /api/dashboard/billing
Get billing status overview with hourly rates and total values.

#### GET /api/dashboard/employee-types
Get employee type distribution (Full-time, Part-time, Contract, Intern).

#### GET /api/dashboard/bench
Get bench analysis including employees awaiting assignment and duration metrics.

### Employee Operations

#### GET /api/employees
Retrieve all employees with optional filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `department` (optional): Filter by department
- `employeeType` (optional): Filter by employee type
- `location` (optional): Filter by location

#### GET /api/employees/:id
Retrieve a specific employee by ID.

#### POST /api/employees
Add a new employee.

**Required Fields:**
- `department`: Employee's department
- `role`: Employee's role/position
- `employeeType`: Full-time, Part-time, Contract, or Intern
- `location`: Work location
- `billingStatus`: Billable, Non-billable, or Overhead
- `startDate`: Employment start date (ISO format)

**Optional Fields:**
- `costCenter`: Cost center code
- `hourlyRate`: Hourly billing rate
- `utilizationTarget`: Target utilization percentage (default: 80)
- `endDate`: Employment end date
- `skills`: Array of skills/technologies

#### PUT /api/employees/:id
Update an existing employee.

#### DELETE /api/employees/:id
Delete an employee (soft delete).

#### GET /api/employees/search/:term
Search employees by term (searches role, department, location, and skills).

#### GET /api/employees/filters/:type
Get unique values for dropdown filters (departments, locations, employeeTypes, billingStatuses).

#### GET /api/employees/export
Export employees data in CSV or JSON format.

**Query Parameters:**
- `format` (optional): Export format - 'csv' or 'json' (default: csv)
- `department` (optional): Filter by department
- `employeeType` (optional): Filter by employee type
- `location` (optional): Filter by location

## Database Setup

### Prerequisites
- PostgreSQL 12+ installed and running
- Database user with CREATE DATABASE privileges

### Quick Setup (Recommended)
Run the complete database setup process:
```bash
npm run db:setup
```

This will:
1. Check all prerequisites
2. Create the database if it doesn't exist
3. Run all migrations
4. Insert sample data

### Manual Setup (Step by Step)

#### Step 1: Check Prerequisites
```bash
npm run db:check
```

#### Step 2: Database Configuration
Update the `.env` file with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_management
DB_USER=your_username
DB_PASSWORD=your_password
```

#### Step 3: Initialize Database
```bash
npm run db:init
```

#### Step 4: Run Migrations
```bash
npm run migrate
```

### Troubleshooting

#### PostgreSQL Not Installed
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql && brew services start postgresql`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

#### Service Not Running
- **Windows**: `net start postgresql-x64-14` (adjust version)
- **macOS**: `brew services start postgresql`
- **Linux**: `sudo systemctl start postgresql`

#### Connection Issues
- Verify credentials in `.env` file
- Check if PostgreSQL is listening on the correct port
- Ensure user has necessary privileges

#### Database Already Exists
If you need to reset the database:
```sql
DROP DATABASE IF EXISTS employee_management;
```
Then run `npm run db:setup` again.

## Data Structure

### Bulk Upload File Formats

#### CSV Format
```csv
department,cost_center,role,employee_type,location,billing_status,hourly_rate,utilization_target,start_date,end_date,skills
"Engineering","ENG001","Software Developer","Full-time","New York","Billable",75.00,80,"2024-01-15","","JavaScript, React, Node.js"
"Design","DES001","UX Designer","Contract","San Francisco","Billable",85.00,75,"2024-02-01","2024-12-31","Figma, Adobe XD, Prototyping"
```

#### JSON Format
```json
{
  "employees": [
    {
      "department": "Engineering",
      "costCenter": "ENG001",
      "role": "Software Developer",
      "employeeType": "Full-time",
      "location": "New York",
      "billingStatus": "Billable",
      "hourlyRate": 75.00,
      "utilizationTarget": 80,
      "startDate": "2024-01-15",
      "endDate": null,
      "skills": ["JavaScript", "React", "Node.js"]
    }
  ]
}
```

### Bulk Upload Response
```json
{
  "success": true,
  "message": "Bulk upload completed",
  "data": {
    "total": 25,
    "successful": 23,
    "failed": 2,
    "errors": [
      {
        "row": 5,
        "type": "validation",
        "errors": [
          {
            "field": "department",
            "message": "Department is required"
          }
        ]
      }
    ],
    "createdEmployees": [
      {
        "row": 1,
        "id": "uuid",
        "department": "Engineering",
        "role": "Software Developer"
      }
    ]
  }
}
```

### Employee Object
```json
{
  "id": "uuid",
  "department": "Engineering",
  "costCenter": "ENG001",
  "role": "Senior Software Developer",
  "employeeType": "Full-time",
  "location": "New York",
  "billingStatus": "Billable",
  "hourlyRate": 85.00,
  "utilizationTarget": 80,
  "startDate": "2024-01-15",
  "endDate": null,
  "skills": ["JavaScript", "React", "Node.js"],
  "status": "active",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   - Install and start PostgreSQL
   - Create a database named `employee_management`
   - Update `.env` file with your database credentials

3. **Environment Setup:**
   Update the `.env` file with:
   ```
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=employee_management
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

4. **Run Database Migrations:**
   ```bash
   npm run migrate
   ```

5. **Start the Server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Health Check:**
   Visit `http://localhost:3000/health` to verify the API is running.

## Example Usage

### Bulk Upload Examples

#### Download Template
```bash
# Download CSV template
curl "http://localhost:3000/api/bulk-upload/template" -o employee_template.csv

# Download JSON template
curl "http://localhost:3000/api/bulk-upload/template?format=json" -o employee_template.json
```

#### Validate File Before Upload
```bash
curl -X POST http://localhost:3000/api/bulk-upload/validate \
  -F "file=@employees.csv"
```

#### Upload Bulk Employee Data
```bash
# Upload CSV file
curl -X POST http://localhost:3000/api/bulk-upload \
  -F "file=@employees.csv"

# Upload JSON file
curl -X POST http://localhost:3000/api/bulk-upload \
  -F "file=@employees.json"
```

#### Get Upload History
```bash
curl "http://localhost:3000/api/bulk-upload/history"
```

### Dashboard APIs

#### Get Dashboard Overview
```bash
curl "http://localhost:3000/api/dashboard/overview"
```

#### Get Department Analytics
```bash
curl "http://localhost:3000/api/dashboard/departments"
```

#### Get Utilization Metrics
```bash
curl "http://localhost:3000/api/dashboard/utilization?period=60"
```

#### Get Skills Distribution
```bash
curl "http://localhost:3000/api/dashboard/skills?limit=15"
```

#### Get Bench Analysis
```bash
curl "http://localhost:3000/api/dashboard/bench"
```

### Add New Employee
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "department": "Engineering",
    "costCenter": "ENG002",
    "role": "Frontend Developer",
    "employeeType": "Full-time",
    "location": "Austin",
    "billingStatus": "Billable",
    "hourlyRate": 70.00,
    "utilizationTarget": 85,
    "startDate": "2024-03-01",
    "skills": ["React", "TypeScript", "CSS"]
  }'
```

### Get All Employees with Filtering
```bash
curl "http://localhost:3000/api/employees?department=Engineering&page=1&limit=5"
```

### Search Employees
```bash
curl "http://localhost:3000/api/employees/search/React"
```

### Get Filter Options
```bash
curl "http://localhost:3000/api/employees/filters/departments"
```

### Export Employees
```bash
# Export as CSV
curl "http://localhost:3000/api/employees/export?format=csv" -o employees.csv

# Export as JSON with filters
curl "http://localhost:3000/api/employees/export?format=json&department=Engineering" -o employees.json
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": {
    "errors": [...]
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## Architecture

The API follows a modular architecture with PostgreSQL integration:

- **Database** (`src/config/database.js`): PostgreSQL connection and query management
- **Migrations** (`src/database/migrations/`): Database schema and initial data
- **Routes** (`src/routes/`): Define API endpoints
- **Controllers** (`src/controllers/`): Handle business logic
- **Models** (`src/models/`): Database operations and data management
- **Middleware** (`src/middleware/`): Validation and error handling
- **Utils** (`src/utils/`): Helper functions and utilities

## Database Schema

The `employees` table includes:
- **Organizational fields**: department, cost_center, role, employee_type, location, billing_status
- **Professional fields**: hourly_rate, utilization_target, start_date, end_date
- **Additional fields**: skills (array), status, timestamps
- **Indexes**: Optimized for common queries and searches
- **Constraints**: Data validation at database level

## Security Features

- **Helmet.js**: Security headers protection
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error responses without data leaks
- **Rate Limiting Ready**: Architecture supports rate limiting implementation
- **SQL Injection Protection**: Parameterized queries throughout

## Production Considerations

For production deployment:

1. Set up database connection pooling and monitoring
2. Add authentication and authorization
3. Implement rate limiting
4. Add comprehensive logging
5. Set up monitoring and health checks
6. Configure proper CORS origins
7. Add API documentation (Swagger/OpenAPI)
8. Set up database backups and replication
9. Configure SSL/TLS for database connections