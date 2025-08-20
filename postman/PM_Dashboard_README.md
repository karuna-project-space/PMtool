# 📊 PM Dashboard API - Postman Collection

## 🎯 **Complete API Collection for PM Operations Dashboard**

This Postman collection provides comprehensive testing for the PM Operations Dashboard integrated with Employee Management API.

## 📥 **Quick Import Instructions:**

### **Step 1: Download Collection**
1. **Right-click** on `PM_Dashboard_Collection.postman_collection.json`
2. **Select "Save As"** or **"Download"**
3. **Save to your computer**

### **Step 2: Import into Postman**
1. **Open Postman** application
2. **Click "Import"** button (top left)
3. **Select "Upload Files"**
4. **Choose** the downloaded `.json` file
5. **Click "Import"**

### **Step 3: Set Base URL**
1. **Update environment variable** `baseUrl` to `http://localhost:3000`
2. **Start your server**: `npm run dev`
3. **Begin testing!**

## 🚀 **API Endpoints Included:**

### **📊 PM Dashboard APIs (NEW):**
- **GET /api/pm/dashboard** - Complete dashboard overview with KPIs
- **GET /api/pm/projects** - Project management data (Alpha, Beta projects)
- **GET /api/pm/resources** - Resource allocation and utilization metrics
- **GET /api/pm/bench-report** - Bench analysis with cost calculations
- **GET /api/pm/currency** - Multi-currency project tracking

### **👥 Employee Management:**
- **GET /api/employees** - List all employees with pagination
- **POST /api/employees** - Add new employee
- **GET /api/employees/search/:term** - Search employees

### **📈 Dashboard Analytics:**
- **GET /api/dashboard/overview** - Core dashboard statistics
- **GET /api/dashboard/departments** - Department breakdown
- **GET /api/dashboard/utilization** - Utilization metrics
- **GET /api/dashboard/bench** - Bench analysis

### **📄 Report Generation:**
- **GET /api/reports/types** - Available report types
- **GET /api/reports/generate** - Generate comprehensive reports
- **GET /api/reports/generate/:type** - Generate specific reports

## 🎨 **PM Dashboard Data Structure:**

### **Dashboard Overview Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "inr": "₹5,41,12,500",
      "usd": "$650,000",
      "growth": "+12.5%"
    },
    "profit": {
      "inr": "₹1,24,87,500",
      "usd": "$150,000",
      "margin": "23.1%"
    },
    "utilization": {
      "current": 77.5,
      "target": 80,
      "status": "alert"
    },
    "activeProjects": 2,
    "recentProjects": [
      {
        "id": 1,
        "name": "Project Alpha",
        "profit": "$130,000",
        "status": "active"
      }
    ],
    "resourceAlerts": [
      {
        "type": "warning",
        "title": "Underutilized Resources",
        "description": "2 resources on bench"
      }
    ]
  }
}
```

### **Projects Data Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 1,
        "name": "Project Alpha",
        "department": "Engineering",
        "profit": "$130,000",
        "status": "active",
        "team": 5,
        "utilization": 80
      }
    ]
  }
}
```

## 🔧 **Testing Workflow:**

### **1. Start Your Server:**
```bash
npm run dev
```

### **2. Test PM Dashboard:**
1. **Health Check** - Verify API is running
2. **PM Dashboard Overview** - Get main KPIs
3. **Projects Data** - Get project information
4. **Resources Data** - Get resource metrics
5. **Bench Report** - Get bench analysis
6. **Currency Data** - Get currency information

### **3. Test Integration:**
1. **Add Employee** - Add new team member
2. **Dashboard Overview** - See updated metrics
3. **Generate Report** - Create comprehensive report
4. **PM Dashboard** - View updated project data

## 🎯 **Perfect for PM Operations:**

This collection provides everything needed for the PM Operations Dashboard:
- ✅ **Real-time KPIs** - Revenue, Profit, Utilization, Projects
- ✅ **Project Tracking** - Alpha and Beta project management
- ✅ **Resource Management** - Team allocation and bench analysis
- ✅ **Financial Metrics** - Multi-currency revenue tracking
- ✅ **Alert System** - Resource utilization warnings
- ✅ **Report Generation** - Comprehensive analytics reports

## 🌟 **Integration Benefits:**

The PM Dashboard APIs integrate seamlessly with your Employee Management system:
- **Live Data** - Uses real employee database
- **Calculated Metrics** - Derives project data from employee information
- **Resource Alerts** - Based on actual utilization data
- **Cost Analysis** - Real bench cost calculations
- **Department Mapping** - Maps departments to projects

Start testing your complete PM Operations Dashboard with this comprehensive Postman collection! 🚀