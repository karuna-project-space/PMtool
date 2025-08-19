# 📥 How to Download and Use the Postman Collection

## 🎯 **Quick Download Instructions:**

### **Step 1: Download the Collection File**
1. **Right-click** on `Employee_Management_API_Complete.postman_collection.json`
2. **Select "Save As"** or **"Download"**
3. **Save to your computer** (remember the location)

### **Step 2: Import into Postman**
1. **Open Postman** application
2. **Click "Import"** button (top left)
3. **Select "Upload Files"**
4. **Choose** the downloaded `.json` file
5. **Click "Import"**

### **Step 3: Set Up Environment**
1. **Import** the environment file: `Employee_Management_Environment.postman_environment.json`
2. **Select environment** from dropdown (top right)
3. **Update baseUrl** if your server runs on different port

## 🚀 **What's Included in This Collection:**

### **📊 Complete API Coverage (50+ Endpoints):**
- ✅ **Employee Management** (12 endpoints)
- ✅ **Dashboard Analytics** (10 endpoints) 
- ✅ **Bulk Upload Operations** (5 endpoints)
- ✅ **Report Generation** (12 endpoints)
- ✅ **Health Check** (1 endpoint)

### **📋 Report Generation Features:**
- **6 Report Types:** Comprehensive, Utilization, Department, Bench, Skills, Billing
- **2 Formats:** PDF and Excel
- **Custom Filters:** Department, Location, Date Range
- **Preview Mode:** Check report before generation
- **Professional Output:** Executive summaries and detailed analytics

### **🔧 Ready-to-Use Examples:**
- **Sample Request Bodies** for POST/PUT operations
- **Query Parameters** for filtering and pagination
- **File Upload Examples** for bulk operations
- **Report Generation** with various options
- **Search and Export** functionality

## 🎯 **Testing Workflow:**

### **1. Start Your API Server:**
```bash
npm run dev
```

### **2. Test Basic Functionality:**
1. **Health Check** - Verify API is running
2. **Get All Employees** - Check database connection
3. **Dashboard Overview** - Test analytics

### **3. Test Advanced Features:**
1. **Add New Employee** - Test validation
2. **Bulk Upload** - Download template, upload data
3. **Generate Reports** - Test PDF/Excel generation
4. **Search & Filter** - Test query functionality

## 📄 **Report Generation Examples:**

### **Generate Comprehensive PDF Report:**
```
GET /api/reports/generate?format=pdf&reportType=comprehensive&dateRange=30
```

### **Generate Excel Utilization Report:**
```
GET /api/reports/generate/utilization?format=excel&dateRange=60
```

### **Generate Filtered Department Report:**
```
GET /api/reports/generate/department?format=pdf&departments=Engineering
```

## 🔍 **Environment Variables:**
- `baseUrl`: Your API server URL (default: http://localhost:3000)
- `employeeId`: Set this after creating an employee for testing

## 💡 **Pro Tips:**
1. **Enable/Disable Query Parameters** using checkboxes
2. **Copy Employee IDs** from responses to test specific endpoints
3. **Use the Preview endpoints** before generating large reports
4. **Test file uploads** with the sample CSV/JSON files provided
5. **Check response formats** - all follow consistent structure

## 🎉 **You're Ready!**
This collection contains everything you need to test your Employee Management API, including the new Report Generation feature that matches your HR Analytics Dashboard!

Happy testing! 🚀