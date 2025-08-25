# 🔐 Authentication API - Postman Collection

## 🎯 **Complete Authentication System for OpsDash**

This Postman collection provides comprehensive testing for the authentication system with role-based access control.

## 📥 **Quick Import Instructions:**

### **Step 1: Download Collection**
1. **Right-click** on `Authentication_API.postman_collection.json`
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

## 🚀 **Authentication Endpoints:**

### **🔑 Login Endpoints:**
- **POST /api/auth/login** - User authentication
- **POST /api/auth/logout** - User logout
- **POST /api/auth/forgot-password** - Password recovery

### **👤 Profile Management:**
- **GET /api/auth/profile** - Get current user profile
- **PUT /api/auth/profile** - Update user profile
- **POST /api/auth/change-password** - Change password

### **👥 Admin Operations:**
- **GET /api/auth/users** - Get all users (Admin only)

## 🎭 **Demo Accounts Available:**

### **Project Manager - Pavan Paruchuri**
- **Email:** `pavan.paruchuri@opsdash.com`
- **Password:** `demo123`
- **Permissions:** Dashboard, Projects, Resources, Reports

### **Administrator**
- **Email:** `admin@opsdash.com`
- **Password:** `admin123`
- **Permissions:** All system access + User management

### **HR Manager**
- **Email:** `hr@opsdash.com`
- **Password:** `hr123`
- **Permissions:** Dashboard, Resources, Reports, Employees

### **CEO**
- **Email:** `ceo@opsdash.com`
- **Password:** `ceo123`
- **Permissions:** Dashboard, Projects, Resources, Analytics, Finance

### **Finance Manager**
- **Email:** `finance@opsdash.com`
- **Password:** `finance123`
- **Permissions:** Dashboard, Finance, Reports, Billing

## 🔧 **Testing Workflow:**

### **1. Authentication Flow:**
1. **Login with Demo Account** - Choose any role
2. **Token Auto-Save** - Collection automatically saves JWT token
3. **Access Protected Endpoints** - Use saved token for authenticated requests
4. **Test Profile Management** - Update profile, change password
5. **Logout** - Clear session

### **2. Role-Based Testing:**
1. **Login as different roles** - Test various permission levels
2. **Access Admin Endpoints** - Only Admin can view all users
3. **Test Unauthorized Access** - Try accessing without token
4. **Permission Validation** - Verify role-based restrictions

### **3. Error Handling:**
1. **Invalid Credentials** - Test wrong email/password
2. **Expired Token** - Test token expiration
3. **Missing Token** - Test protected endpoints without authentication
4. **Invalid Token** - Test with malformed tokens

## 🎨 **Login Page Features:**

### **Frontend Login Page (`/login`):**
- ✅ **Modern UI Design** - Clean, professional interface
- ✅ **Demo Account Buttons** - One-click login for all roles
- ✅ **Form Validation** - Client-side validation
- ✅ **Password Toggle** - Show/hide password
- ✅ **Loading States** - Visual feedback during login
- ✅ **Toast Notifications** - Success/error messages
- ✅ **Responsive Design** - Works on all devices

### **Authentication Features:**
- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **Role-Based Access** - Different permissions per role
- ✅ **Password Hashing** - Secure password storage
- ✅ **Token Expiration** - 24-hour token validity
- ✅ **Profile Management** - Update user information
- ✅ **Password Recovery** - Forgot password functionality

## 🔐 **Security Features:**

### **Backend Security:**
- ✅ **JWT Authentication** - Industry standard tokens
- ✅ **Password Hashing** - bcrypt encryption
- ✅ **Role-Based Authorization** - Permission-based access
- ✅ **Token Validation** - Comprehensive token verification
- ✅ **Error Handling** - Secure error responses

### **Frontend Security:**
- ✅ **Token Storage** - Secure localStorage management
- ✅ **Auto-Redirect** - Redirect based on authentication status
- ✅ **Form Validation** - Input sanitization
- ✅ **HTTPS Ready** - Production security ready

## 🎯 **API Response Examples:**

### **Successful Login:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "email": "pavan.paruchuri@opsdash.com",
      "name": "Pavan Paruchuri",
      "role": "Project Manager",
      "permissions": ["dashboard", "projects", "resources", "reports"]
    }
  }
}
```

### **Authentication Error:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

## 🌟 **Integration with Existing APIs:**

The authentication system integrates seamlessly with your existing Employee Management APIs:
- **Protected Endpoints** - All sensitive APIs require authentication
- **Role-Based Access** - Different roles see different data
- **User Context** - APIs know which user is making requests
- **Audit Trail** - Track user actions and changes

Start testing your complete authentication system with this comprehensive Postman collection! 🚀