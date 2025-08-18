const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validation');

// GET /api/employees - Get all employees
router.get('/', employeeController.getAllEmployees);

// GET /api/employees/search/:term - Search employees (must be before /:id route)
router.get('/search/:term', employeeController.searchEmployees);

// GET /api/employees/filters/:type - Get unique values for filters
router.get('/filters/:type', employeeController.getFilterOptions);

// GET /api/employees/export - Export employees
router.get('/export', employeeController.exportEmployees);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', employeeController.getEmployeeById);

// POST /api/employees - Add new employee
router.post('/', validateEmployee, employeeController.addEmployee);

// PUT /api/employees/:id - Update employee
router.put('/:id', validateEmployee, employeeController.updateEmployee);

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;