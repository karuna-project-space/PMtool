const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public routes (no authentication required)
router.post('/login', authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));

// Protected routes (authentication required)
router.get('/profile', authController.verifyToken.bind(authController), authController.getProfile.bind(authController));
router.put('/profile', authController.verifyToken.bind(authController), authController.updateProfile.bind(authController));
router.post('/change-password', authController.verifyToken.bind(authController), authController.changePassword.bind(authController));

// Admin only routes
router.get('/users', authController.verifyToken.bind(authController), authController.getAllUsers.bind(authController));

module.exports = router;