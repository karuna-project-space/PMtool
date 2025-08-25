const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateResponse } = require('../utils/responseHelper');

class AuthController {
  constructor() {
    // Demo users for testing
    this.demoUsers = [
      {
        id: '1',
        email: 'pavan.paruchuri@opsdash.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
        name: 'Pavan Paruchuri',
        role: 'Project Manager',
        permissions: ['dashboard', 'projects', 'resources', 'reports'],
        status: 'active'
      },
      {
        id: '2',
        email: 'admin@opsdash.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
        name: 'Admin User',
        role: 'Administrator',
        permissions: ['dashboard', 'projects', 'resources', 'reports', 'users', 'settings'],
        status: 'active'
      },
      {
        id: '3',
        email: 'hr@opsdash.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // hr123
        name: 'HR Manager',
        role: 'HR Manager',
        permissions: ['dashboard', 'resources', 'reports', 'employees'],
        status: 'active'
      },
      {
        id: '4',
        email: 'ceo@opsdash.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // ceo123
        name: 'CEO',
        role: 'Chief Executive Officer',
        permissions: ['dashboard', 'projects', 'resources', 'reports', 'analytics', 'finance'],
        status: 'active'
      },
      {
        id: '5',
        email: 'finance@opsdash.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // finance123
        name: 'Finance Manager',
        role: 'Finance Manager',
        permissions: ['dashboard', 'finance', 'reports', 'billing'],
        status: 'active'
      }
    ];
  }

  // User login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json(generateResponse(
          false, 
          'Email and password are required'
        ));
      }

      // Find user by email
      const user = this.demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        return res.status(401).json(generateResponse(
          false, 
          'Invalid email or password'
        ));
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json(generateResponse(
          false, 
          'Account is inactive. Please contact administrator.'
        ));
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json(generateResponse(
          false, 
          'Invalid email or password'
        ));
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json(generateResponse(
        true,
        'Login successful',
        {
          token,
          user: userWithoutPassword
        }
      ));

    } catch (error) {
      next(error);
    }
  }

  // User logout
  async logout(req, res, next) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success response
      res.status(200).json(generateResponse(
        true,
        'Logout successful'
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      
      const user = this.demoUsers.find(u => u.id === userId);
      
      if (!user) {
        return res.status(404).json(generateResponse(
          false,
          'User not found'
        ));
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json(generateResponse(
        true,
        'Profile retrieved successfully',
        userWithoutPassword
      ));

    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const { name, email } = req.body;

      const userIndex = this.demoUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return res.status(404).json(generateResponse(
          false,
          'User not found'
        ));
      }

      // Check if email is already taken by another user
      if (email && email !== this.demoUsers[userIndex].email) {
        const emailExists = this.demoUsers.some(u => u.id !== userId && u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
          return res.status(400).json(generateResponse(
            false,
            'Email is already in use'
          ));
        }
      }

      // Update user data
      if (name) this.demoUsers[userIndex].name = name;
      if (email) this.demoUsers[userIndex].email = email;

      // Remove password from response
      const { password: _, ...userWithoutPassword } = this.demoUsers[userIndex];

      res.status(200).json(generateResponse(
        true,
        'Profile updated successfully',
        userWithoutPassword
      ));

    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json(generateResponse(
          false,
          'Current password and new password are required'
        ));
      }

      if (newPassword.length < 6) {
        return res.status(400).json(generateResponse(
          false,
          'New password must be at least 6 characters long'
        ));
      }

      const userIndex = this.demoUsers.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        return res.status(404).json(generateResponse(
          false,
          'User not found'
        ));
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, this.demoUsers[userIndex].password);
      
      if (!isValidPassword) {
        return res.status(400).json(generateResponse(
          false,
          'Current password is incorrect'
        ));
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      this.demoUsers[userIndex].password = hashedPassword;

      res.status(200).json(generateResponse(
        true,
        'Password changed successfully'
      ));

    } catch (error) {
      next(error);
    }
  }

  // Forgot password (demo implementation)
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json(generateResponse(
          false,
          'Email is required'
        ));
      }

      const user = this.demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      // Always return success for security reasons (don't reveal if email exists)
      res.status(200).json(generateResponse(
        true,
        'If an account with that email exists, a password reset link has been sent.'
      ));

      // In a real application, you would:
      // 1. Generate a reset token
      // 2. Store it in database with expiration
      // 3. Send email with reset link

    } catch (error) {
      next(error);
    }
  }

  // Get all users (admin only)
  async getAllUsers(req, res, next) {
    try {
      // Check if user has admin permissions
      if (req.user.role !== 'Administrator') {
        return res.status(403).json(generateResponse(
          false,
          'Access denied. Admin privileges required.'
        ));
      }

      // Remove passwords from response
      const usersWithoutPasswords = this.demoUsers.map(({ password, ...user }) => user);

      res.status(200).json(generateResponse(
        true,
        'Users retrieved successfully',
        {
          users: usersWithoutPasswords,
          total: usersWithoutPasswords.length
        }
      ));

    } catch (error) {
      next(error);
    }
  }

  // Verify token (middleware helper)
  async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json(generateResponse(
          false,
          'Access token is required'
        ));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      const user = this.demoUsers.find(u => u.id === decoded.userId);
      
      if (!user || user.status !== 'active') {
        return res.status(401).json(generateResponse(
          false,
          'Invalid or expired token'
        ));
      }

      req.user = decoded;
      next();

    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json(generateResponse(
          false,
          'Invalid token'
        ));
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json(generateResponse(
          false,
          'Token expired'
        ));
      }
      next(error);
    }
  }
}

module.exports = new AuthController();