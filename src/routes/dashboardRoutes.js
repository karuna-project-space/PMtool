const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/overview - Get dashboard overview statistics
router.get('/overview', dashboardController.getDashboardOverview);

// GET /api/dashboard/analytics - Get employee analytics
router.get('/analytics', dashboardController.getEmployeeAnalytics);

// GET /api/dashboard/utilization - Get utilization metrics
router.get('/utilization', dashboardController.getUtilizationMetrics);

// GET /api/dashboard/departments - Get department breakdown
router.get('/departments', dashboardController.getDepartmentBreakdown);

// GET /api/dashboard/skills - Get skills distribution
router.get('/skills', dashboardController.getSkillsDistribution);

// GET /api/dashboard/activities - Get recent activities
router.get('/activities', dashboardController.getRecentActivities);

// GET /api/dashboard/locations - Get location distribution
router.get('/locations', dashboardController.getLocationDistribution);

// GET /api/dashboard/billing - Get billing overview
router.get('/billing', dashboardController.getBillingOverview);

// GET /api/dashboard/employee-types - Get employee type distribution
router.get('/employee-types', dashboardController.getEmployeeTypeDistribution);

// GET /api/dashboard/bench - Get bench analysis
router.get('/bench', dashboardController.getBenchAnalysis);

module.exports = router;