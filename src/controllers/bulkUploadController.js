const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Employee = require('../models/Employee');
const { generateResponse } = require('../utils/responseHelper');
const { employeeSchema } = require('../middleware/validation');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}_${originalName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
  const allowedExtensions = ['.csv', '.json'];
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and JSON files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

class BulkUploadController {
  // Upload middleware
  uploadMiddleware() {
    return upload.single('file');
  }

  // Process bulk upload
  async processBulkUpload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json(generateResponse(false, 'No file uploaded'));
      }

      const filePath = req.file.path;
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      
      let employees = [];
      
      try {
        if (fileExtension === '.csv') {
          employees = await this.parseCSVFile(filePath);
        } else if (fileExtension === '.json') {
          employees = await this.parseJSONFile(filePath);
        } else {
          throw new Error('Unsupported file format');
        }

        // Validate and process employees
        const result = await this.validateAndCreateEmployees(employees);
        
        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json(generateResponse(
          true,
          'Bulk upload completed',
          result
        ));

      } catch (parseError) {
        // Clean up uploaded file on error
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw parseError;
      }

    } catch (error) {
      next(error);
    }
  }

  // Parse CSV file
  async parseCSVFile(filePath) {
    return new Promise((resolve, reject) => {
      const employees = [];
      const errors = [];

      fs.createReadStream(filePath)
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim().toLowerCase().replace(/\s+/g, '_')
        }))
        .on('data', (row) => {
          try {
            const employee = this.mapCSVRowToEmployee(row);
            employees.push(employee);
          } catch (error) {
            errors.push({
              row: employees.length + 1,
              error: error.message,
              data: row
            });
          }
        })
        .on('end', () => {
          if (errors.length > 0) {
            reject(new Error(`CSV parsing errors: ${JSON.stringify(errors)}`));
          } else {
            resolve(employees);
          }
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  // Parse JSON file
  async parseJSONFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      // Handle both array format and object with employees array
      let employees = [];
      if (Array.isArray(jsonData)) {
        employees = jsonData;
      } else if (jsonData.employees && Array.isArray(jsonData.employees)) {
        employees = jsonData.employees;
      } else {
        throw new Error('Invalid JSON format. Expected array of employees or object with employees array.');
      }

      return employees.map((emp, index) => {
        try {
          return this.mapJSONToEmployee(emp);
        } catch (error) {
          throw new Error(`Row ${index + 1}: ${error.message}`);
        }
      });

    } catch (error) {
      throw new Error(`JSON parsing error: ${error.message}`);
    }
  }

  // Map CSV row to employee object
  mapCSVRowToEmployee(row) {
    // Handle skills - split by comma, semicolon, or pipe
    let skills = [];
    if (row.skills) {
      skills = row.skills.split(/[,;|]/).map(skill => skill.trim()).filter(skill => skill.length > 0);
    }

    return {
      department: row.department,
      costCenter: row.cost_center || row.costcenter,
      role: row.role,
      employeeType: row.employee_type || row.employeetype,
      location: row.location,
      billingStatus: row.billing_status || row.billingstatus,
      hourlyRate: row.hourly_rate || row.hourlyrate ? parseFloat(row.hourly_rate || row.hourlyrate) : undefined,
      utilizationTarget: row.utilization_target || row.utilizationtarget ? parseInt(row.utilization_target || row.utilizationtarget) : 80,
      startDate: row.start_date || row.startdate,
      endDate: row.end_date || row.enddate || null,
      skills: skills
    };
  }

  // Map JSON to employee object
  mapJSONToEmployee(emp) {
    return {
      department: emp.department,
      costCenter: emp.costCenter || emp.cost_center,
      role: emp.role,
      employeeType: emp.employeeType || emp.employee_type,
      location: emp.location,
      billingStatus: emp.billingStatus || emp.billing_status,
      hourlyRate: emp.hourlyRate || emp.hourly_rate ? parseFloat(emp.hourlyRate || emp.hourly_rate) : undefined,
      utilizationTarget: emp.utilizationTarget || emp.utilization_target ? parseInt(emp.utilizationTarget || emp.utilization_target) : 80,
      startDate: emp.startDate || emp.start_date,
      endDate: emp.endDate || emp.end_date || null,
      skills: Array.isArray(emp.skills) ? emp.skills : []
    };
  }

  // Validate and create employees
  async validateAndCreateEmployees(employees) {
    const results = {
      total: employees.length,
      successful: 0,
      failed: 0,
      errors: [],
      createdEmployees: []
    };

    for (let i = 0; i < employees.length; i++) {
      const employee = employees[i];
      const rowNumber = i + 1;

      try {
        // Validate employee data
        const { error, value } = employeeSchema.validate(employee, {
          abortEarly: false,
          stripUnknown: true
        });

        if (error) {
          const validationErrors = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }));

          results.failed++;
          results.errors.push({
            row: rowNumber,
            type: 'validation',
            errors: validationErrors,
            data: employee
          });
          continue;
        }

        // Create employee
        const newEmployee = await Employee.create(value);
        results.successful++;
        results.createdEmployees.push({
          row: rowNumber,
          id: newEmployee.id,
          department: newEmployee.department,
          role: newEmployee.role
        });

      } catch (dbError) {
        results.failed++;
        results.errors.push({
          row: rowNumber,
          type: 'database',
          message: dbError.message,
          data: employee
        });
      }
    }

    return results;
  }

  // Get bulk upload template
  async getUploadTemplate(req, res, next) {
    try {
      const { format = 'csv' } = req.query;

      const templateData = [
        {
          department: 'Engineering',
          cost_center: 'ENG001',
          role: 'Software Developer',
          employee_type: 'Full-time',
          location: 'New York',
          billing_status: 'Billable',
          hourly_rate: 75.00,
          utilization_target: 80,
          start_date: '2024-01-15',
          end_date: '',
          skills: 'JavaScript, React, Node.js'
        },
        {
          department: 'Design',
          cost_center: 'DES001',
          role: 'UX Designer',
          employee_type: 'Contract',
          location: 'San Francisco',
          billing_status: 'Billable',
          hourly_rate: 85.00,
          utilization_target: 75,
          start_date: '2024-02-01',
          end_date: '2024-12-31',
          skills: 'Figma, Adobe XD, Prototyping'
        }
      ];

      if (format.toLowerCase() === 'json') {
        const jsonTemplate = {
          employees: templateData.map(emp => ({
            department: emp.department,
            costCenter: emp.cost_center,
            role: emp.role,
            employeeType: emp.employee_type,
            location: emp.location,
            billingStatus: emp.billing_status,
            hourlyRate: emp.hourly_rate,
            utilizationTarget: emp.utilization_target,
            startDate: emp.start_date,
            endDate: emp.end_date || null,
            skills: emp.skills.split(', ')
          }))
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="employee_template.json"');
        return res.send(JSON.stringify(jsonTemplate, null, 2));
      } else {
        // CSV template
        const csvHeaders = Object.keys(templateData[0]).join(',');
        const csvRows = templateData.map(row => 
          Object.values(row).map(value => `"${value}"`).join(',')
        );
        const csvContent = [csvHeaders, ...csvRows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="employee_template.csv"');
        return res.send(csvContent);
      }

    } catch (error) {
      next(error);
    }
  }

  // Get upload status/history
  async getUploadHistory(req, res, next) {
    try {
      // This would typically come from a database table tracking uploads
      // For now, return a mock response
      const history = [
        {
          id: 1,
          filename: 'employees_batch_1.csv',
          uploadDate: new Date().toISOString(),
          totalRecords: 25,
          successful: 23,
          failed: 2,
          status: 'completed'
        }
      ];

      res.status(200).json(generateResponse(
        true,
        'Upload history retrieved successfully',
        { history }
      ));

    } catch (error) {
      next(error);
    }
  }

  // Validate file before upload
  async validateFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json(generateResponse(false, 'No file provided'));
      }

      const filePath = req.file.path;
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      
      let employees = [];
      let validationResults = {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        errors: [],
        preview: []
      };

      try {
        if (fileExtension === '.csv') {
          employees = await this.parseCSVFile(filePath);
        } else if (fileExtension === '.json') {
          employees = await this.parseJSONFile(filePath);
        }

        validationResults.totalRows = employees.length;

        // Validate first 5 rows for preview
        const previewCount = Math.min(5, employees.length);
        for (let i = 0; i < previewCount; i++) {
          const employee = employees[i];
          const { error } = employeeSchema.validate(employee, { abortEarly: false });
          
          if (error) {
            validationResults.invalidRows++;
            validationResults.errors.push({
              row: i + 1,
              errors: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
              }))
            });
          } else {
            validationResults.validRows++;
          }

          validationResults.preview.push({
            row: i + 1,
            data: employee,
            valid: !error
          });
        }

        // Clean up file
        fs.unlinkSync(filePath);

        res.status(200).json(generateResponse(
          true,
          'File validation completed',
          validationResults
        ));

      } catch (parseError) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw parseError;
      }

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BulkUploadController();