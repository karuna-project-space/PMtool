/**
 * Export utilities for employee data
 */

/**
 * Convert employees array to CSV format
 * @param {Array} employees - Array of employee objects
 * @returns {string} CSV formatted string
 */
const exportToCSV = (employees) => {
  if (!employees || employees.length === 0) {
    return '';
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Department',
    'Cost Center',
    'Role',
    'Employee Type',
    'Location',
    'Billing Status',
    'Hourly Rate',
    'Utilization Target',
    'Start Date',
    'End Date',
    'Skills',
    'Status',
    'Created At',
    'Updated At'
  ];

  // Create CSV content
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  employees.forEach(employee => {
    const row = [
      `"${employee.id || ''}"`,
      `"${employee.department || ''}"`,
      `"${employee.cost_center || ''}"`,
      `"${employee.role || ''}"`,
      `"${employee.employee_type || ''}"`,
      `"${employee.location || ''}"`,
      `"${employee.billing_status || ''}"`,
      `"${employee.hourly_rate || ''}"`,
      `"${employee.utilization_target || ''}"`,
      `"${employee.start_date || ''}"`,
      `"${employee.end_date || ''}"`,
      `"${Array.isArray(employee.skills) ? employee.skills.join('; ') : ''}"`,
      `"${employee.status || ''}"`,
      `"${employee.created_at || ''}"`,
      `"${employee.updated_at || ''}"`
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

/**
 * Convert employees array to JSON format
 * @param {Array} employees - Array of employee objects
 * @returns {string} JSON formatted string
 */
const exportToJSON = (employees) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalRecords: employees.length,
    employees: employees.map(employee => ({
      id: employee.id,
      organizationalInfo: {
        department: employee.department,
        costCenter: employee.cost_center,
        role: employee.role,
        employeeType: employee.employee_type,
        location: employee.location,
        billingStatus: employee.billing_status
      },
      professionalDetails: {
        hourlyRate: employee.hourly_rate,
        utilizationTarget: employee.utilization_target,
        startDate: employee.start_date,
        endDate: employee.end_date
      },
      additionalInfo: {
        skills: employee.skills || [],
        status: employee.status
      },
      timestamps: {
        createdAt: employee.created_at,
        updatedAt: employee.updated_at
      }
    }))
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Get export statistics
 * @param {Array} employees - Array of employee objects
 * @returns {object} Export statistics
 */
const getExportStats = (employees) => {
  if (!employees || employees.length === 0) {
    return {
      totalEmployees: 0,
      departments: [],
      employeeTypes: [],
      locations: []
    };
  }

  const departments = [...new Set(employees.map(emp => emp.department))];
  const employeeTypes = [...new Set(employees.map(emp => emp.employee_type))];
  const locations = [...new Set(employees.map(emp => emp.location))];

  return {
    totalEmployees: employees.length,
    departments: departments.sort(),
    employeeTypes: employeeTypes.sort(),
    locations: locations.sort()
  };
};

module.exports = {
  exportToCSV,
  exportToJSON,
  getExportStats
};