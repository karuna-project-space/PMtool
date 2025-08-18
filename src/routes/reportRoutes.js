const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /api/reports/types - Get available report types
router.get('/types', reportController.getReportTypes);

// GET /api/reports/preview - Get report preview
router.get('/preview', reportController.getReportPreview);

// GET /api/reports/generate - Generate comprehensive HR analytics report
router.get('/generate', reportController.generateHRAnalyticsReport);

// GET /api/reports/generate/:reportType - Generate specific report type
router.get('/generate/:reportType', reportController.generateSpecificReport);

module.exports = router;