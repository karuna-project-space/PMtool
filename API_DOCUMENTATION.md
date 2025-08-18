# Employee Management API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Currently, the API does not require authentication. In production, implement proper authentication and authorization.

## Response Format

All API responses follow this structure:

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

## Endpoints

### Health Check
- **GET** `/health`
- **Description**: Check API status
- **Response**: API health information

### Employee Management

#### Get All Employees
- **GET** `/api/employees`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `department` (optional): Filter by department
  - `employeeType` (optional): Filter by employee type
  - `location` (optional): Filter by location

#### Get Employee by ID
- **GET** `/api/employees/:id`
- **Parameters**: `id` - Employee UUID

#### Create Employee
- **POST** `/api/employees`
- **Body**: Employee object (see Employee Schema)

#### Update Employee
- **PUT** `/api/employees/:id`
- **Parameters**: `id` - Employee UUID
- **Body**: Updated employee fields

#### Delete Employee
- **DELETE** `/api/employees/:id`
- **Parameters**: `id` - Employee UUID

#### Search Employees
- **GET** `/api/employees/search/:term`
- **Parameters**: `term` - Search term

#### Get Filter Options
- **GET** `/api/employees/filters/:type`
- **Parameters**: `type` - Filter type (departments, locations, employeeTypes, billingStatuses)

#### Export Employees
- **GET** `/api/employees/export`
- **Query Parameters**:
  - `format` (optional): Export format (csv, json)
  - `department` (optional): Filter by department
  - `employeeType` (optional): Filter by employee type
  - `location` (optional): Filter by location

### Dashboard Analytics

#### Dashboard Overview
- **GET** `/api/dashboard/overview`
- **Description**: Get main dashboard statistics

#### Employee Analytics
- **GET** `/api/dashboard/analytics`
- **Description**: Get employee analytics by department

#### Utilization Metrics
- **GET** `/api/dashboard/utilization`
- **Query Parameters**:
  - `period` (optional): Analysis period in days (default: 30)

#### Department Breakdown
- **GET** `/api/dashboard/departments`
- **Description**: Get department-wise employee breakdown

#### Skills Distribution
- **GET** `/api/dashboard/skills`
- **Query Parameters**:
  - `limit` (optional): Number of top skills (default: 10)

#### Recent Activities
- **GET** `/api/dashboard/activities`
- **Query Parameters**:
  - `limit` (optional): Number of recent activities (default: 10)

#### Location Distribution
- **GET** `/api/dashboard/locations`
- **Description**: Get location-wise employee distribution

#### Billing Overview
- **GET** `/api/dashboard/billing`
- **Description**: Get billing status overview

#### Employee Type Distribution
- **GET** `/api/dashboard/employee-types`
- **Description**: Get employee type distribution

#### Bench Analysis
- **GET** `/api/dashboard/bench`
- **Description**: Get bench analysis and metrics

### Bulk Upload

#### Process Bulk Upload
- **POST** `/api/bulk-upload`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` - CSV or JSON file

#### Validate File
- **POST** `/api/bulk-upload/validate`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` - CSV or JSON file

#### Download Template
- **GET** `/api/bulk-upload/template`
- **Query Parameters**:
  - `format` (optional): Template format (csv, json)

#### Upload History
- **GET** `/api/bulk-upload/history`
- **Description**: Get bulk upload history

## Data Schemas

### Employee Schema
```json
{
  "id": "uuid",
  "department": "string (required)",
  "costCenter": "string (optional)",
  "role": "string (required)",
  "employeeType": "Full-time|Part-time|Contract|Intern (required)",
  "location": "string (required)",
  "billingStatus": "Billable|Non-billable|Overhead (required)",
  "hourlyRate": "number (optional)",
  "utilizationTarget": "number (default: 80)",
  "startDate": "date (required, ISO format)",
  "endDate": "date (optional, ISO format)",
  "skills": "array of strings (optional)",
  "status": "active|inactive|deleted (default: active)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Bulk Upload Response Schema
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

## Error Codes

- **400**: Bad Request - Invalid input data
- **404**: Not Found - Resource not found
- **413**: Payload Too Large - File size exceeds limit
- **500**: Internal Server Error - Server error

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production use.

## CORS

CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:4173`

Update CORS configuration for production domains.