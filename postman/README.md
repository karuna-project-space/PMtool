# Postman Collection for Employee Management API

## 📋 Collection Overview

This Postman collection contains all the API endpoints for the Employee Management System with comprehensive examples and test data.

## 🚀 Quick Setup

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select `Employee_Management_API.postman_collection.json`
4. Import `Employee_Management_Environment.postman_environment.json`

### 2. Set Environment
1. Select "Employee Management Environment" from the environment dropdown
2. Update the `baseUrl` if your server runs on a different port

### 3. Start Testing
1. Start your API server: `npm run dev`
2. Run the "API Health Check" to verify connection
3. Test all endpoints!

## 📁 Collection Structure

### **Health Check**
- API Health Check - Verify server is running

### **Employee Management**
- Get All Employees (with pagination and filters)
- Get Employee by ID
- Add New Employee
- Update Employee
- Delete Employee
- Search Employees
- Get Filter Options (departments, locations, types, billing statuses)
- Export Employees (CSV/JSON)

### **Dashboard Analytics**
- Dashboard Overview - Key metrics and statistics
- Employee Analytics - Department-wise analytics
- Utilization Metrics - Employee utilization analysis
- Department Breakdown - Detailed department statistics
- Skills Distribution - Most common skills
- Recent Activities - Latest employee activities
- Location Distribution - Geographic distribution
- Billing Overview - Billing status analysis
- Employee Type Distribution - Full-time vs Contract analysis
- Bench Analysis - Non-billable employee analysis

### **Bulk Upload**
- Download CSV Template
- Download JSON Template
- Validate File Before Upload
- Process Bulk Upload
- Get Upload History

## 🔧 Environment Variables

The collection uses these environment variables:
- `baseUrl`: API base URL (default: http://localhost:3000)
- `employeeId`: Employee ID for testing (set this manually)

## 📝 Sample Data

### Employee Creation Example:
```json
{
  "department": "Engineering",
  "costCenter": "ENG003",
  "role": "Full Stack Developer",
  "employeeType": "Full-time",
  "location": "San Francisco",
  "billingStatus": "Billable",
  "hourlyRate": 80.00,
  "utilizationTarget": 85,
  "startDate": "2024-03-01",
  "endDate": null,
  "skills": ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker"]
}
```

### Search Examples:
- Search by skill: `/api/employees/search/JavaScript`
- Search by role: `/api/employees/search/Developer`
- Search by department: `/api/employees/search/Engineering`

### Filter Examples:
- Filter by department: `?department=Engineering`
- Filter by type: `?employeeType=Full-time`
- Filter by location: `?location=New York`
- Combined filters: `?department=Engineering&employeeType=Full-time&location=Seattle`

## 🧪 Testing Workflow

### 1. Basic Testing:
1. Health Check
2. Get All Employees
3. Get Employee by ID (copy ID from previous response)
4. Add New Employee
5. Update Employee
6. Search Employees

### 2. Dashboard Testing:
1. Dashboard Overview
2. Department Breakdown
3. Skills Distribution
4. Utilization Metrics
5. Bench Analysis

### 3. Bulk Upload Testing:
1. Download Template
2. Validate File
3. Process Upload
4. Check Upload History

## 🔍 Response Examples

### Success Response:
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "employees": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "department",
        "message": "Department is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## 🎯 Tips for Testing

1. **Set Employee ID**: After creating an employee, copy the ID to the environment variable
2. **Enable/Disable Filters**: Use the checkboxes in query parameters to test different filters
3. **File Uploads**: For bulk upload, prepare CSV/JSON files with employee data
4. **Export Testing**: Test both CSV and JSON export formats
5. **Pagination**: Test different page numbers and limits

## 🚀 Production Testing

When testing against production:
1. Update `baseUrl` in environment to your production URL
2. Add authentication headers if required
3. Test with real data carefully
4. Use smaller limits for initial testing

Happy testing! 🎉