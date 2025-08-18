const Employee = require('../models/Employee');
const { generateResponse } = require('../utils/responseHelper');
const { exportToCSV, exportToJSON } = require('../utils/exportHelper');

class EmployeeController {
  // Get all employees
  async getAllEmployees(req, res, next) {
    try {
      const { page = 1, limit = 10, department, employeeType, location } = req.query;
      
      const filters = {};
      if (department) filters.department = department;
      if (employeeType) filters.employeeType = employeeType;
      if (location) filters.location = location;

      const employees = await Employee.getAll(filters, parseInt(page), parseInt(limit));
      const total = await Employee.count(filters);

      res.status(200).json(generateResponse(true, 'Employees retrieved successfully', {
        employees,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }));
    } catch (error) {
      next(error);
    }
  }

  // Get employee by ID
  async getEmployeeById(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await Employee.getById(id);

      if (!employee) {
        return res.status(404).json(generateResponse(false, 'Employee not found'));
      }

      res.status(200).json(generateResponse(true, 'Employee retrieved successfully', employee));
    } catch (error) {
      next(error);
    }
  }

  // Add new employee
  async addEmployee(req, res, next) {
    try {
      const employeeData = {
        // Organizational Information
        department: req.body.department,
        costCenter: req.body.costCenter,
        role: req.body.role,
        employeeType: req.body.employeeType,
        location: req.body.location,
        billingStatus: req.body.billingStatus,
        
        // Professional Details
        hourlyRate: req.body.hourlyRate,
        utilizationTarget: req.body.utilizationTarget || 80,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        
        // Additional Information
        skills: req.body.skills || []
      };

      const newEmployee = await Employee.create(employeeData);

      res.status(201).json(generateResponse(
        true, 
        'Employee added successfully', 
        newEmployee
      ));
    } catch (error) {
      next(error);
    }
  }

  // Update employee
  async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await Employee.getById(id);

      if (!employee) {
        return res.status(404).json(generateResponse(false, 'Employee not found'));
      }

      const updatedEmployee = await Employee.update(id, req.body);

      res.status(200).json(generateResponse(
        true, 
        'Employee updated successfully', 
        updatedEmployee
      ));
    } catch (error) {
      next(error);
    }
  }

  // Delete employee
  async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const employee = await Employee.getById(id);

      if (!employee) {
        return res.status(404).json(generateResponse(false, 'Employee not found'));
      }

      await Employee.delete(id);

      res.status(200).json(generateResponse(true, 'Employee deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  // Search employees
  async searchEmployees(req, res, next) {
    try {
      const { term } = req.params;
      const { limit = 10 } = req.query;

      const employees = await Employee.search(term, parseInt(limit));

      res.status(200).json(generateResponse(
        true, 
        'Search completed successfully', 
        { employees, searchTerm: term }
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get filter options for dropdowns
  async getFilterOptions(req, res, next) {
    try {
      const { type } = req.params;
      
      const validTypes = ['departments', 'locations', 'employeeTypes', 'billingStatuses'];
      if (!validTypes.includes(type)) {
        return res.status(400).json(generateResponse(false, 'Invalid filter type'));
      }

      const options = await Employee.getUniqueValues(type);

      res.status(200).json(generateResponse(
        true, 
        `${type} retrieved successfully`, 
        { [type]: options }
      ));
    } catch (error) {
      next(error);
    }
  }

  // Export employees
  async exportEmployees(req, res, next) {
    try {
      const { format = 'csv', department, employeeType, location } = req.query;
      
      const filters = {};
      if (department) filters.department = department;
      if (employeeType) filters.employeeType = employeeType;
      if (location) filters.location = location;

      // Get all employees matching filters (no pagination for export)
      const employees = await Employee.getAll(filters, 1, 10000);

      if (employees.length === 0) {
        return res.status(404).json(generateResponse(false, 'No employees found to export'));
      }

      const timestamp = new Date().toISOString().split('T')[0];
      
      if (format.toLowerCase() === 'json') {
        const jsonData = exportToJSON(employees);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="employees_${timestamp}.json"`);
        return res.send(jsonData);
      } else {
        // Default to CSV
        const csvData = exportToCSV(employees);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="employees_${timestamp}.csv"`);
        return res.send(csvData);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();