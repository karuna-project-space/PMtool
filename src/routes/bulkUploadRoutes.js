const express = require('express');
const router = express.Router();
const bulkUploadController = require('../controllers/bulkUploadController');

// POST /api/bulk-upload - Upload and process bulk employee data
router.post('/', 
  bulkUploadController.uploadMiddleware(),
  bulkUploadController.processBulkUpload
);

// POST /api/bulk-upload/validate - Validate file without processing
router.post('/validate',
  bulkUploadController.uploadMiddleware(),
  bulkUploadController.validateFile
);

// GET /api/bulk-upload/template - Download template file
router.get('/template', bulkUploadController.getUploadTemplate);

// GET /api/bulk-upload/history - Get upload history
router.get('/history', bulkUploadController.getUploadHistory);

module.exports = router;