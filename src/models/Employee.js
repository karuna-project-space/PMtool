const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Employee {
  // Get all employees with filtering and pagination
  static async getAll(filters = {}, page = 1, limit = 10) {
    try {
      let whereClause = "WHERE status = 'active'";
      const queryParams = [];
      let paramCount = 0;

      // Build dynamic WHERE clause based on filters
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          paramCount++;
          if (key === 'skills') {
            whereClause += ` AND $${paramCount} = ANY(skills)`;
          } else {
            whereClause += ` AND LOWER(${key}) LIKE LOWER($${paramCount})`;
          }
          queryParams.push(key === 'skills' ? filters[key] : `%${filters[key]}%`);
        }
      });

      // Add pagination
      const offset = (page - 1) * limit;
      paramCount++;
      const limitParam = paramCount;
      paramCount++;
      const offsetParam = paramCount;
      
      queryParams.push(limit, offset);

      const queryText = `
        SELECT 
          id, department, cost_center, role, employee_type, location, billing_status,
          hourly_rate, utilization_target, start_date, end_date, skills, status,
          created_at, updated_at
        FROM employees 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${limitParam} OFFSET $${offsetParam}
      `;

      const result = await query(queryText, queryParams);
      return result.rows;
    } catch (error) {
      console.error('Error in Employee.getAll:', error);
      throw error;
    }
  }

  // Get employee by ID
  static async getById(id) {
    try {
      const queryText = `
        SELECT 
          id, department, cost_center, role, employee_type, location, billing_status,
          hourly_rate, utilization_target, start_date, end_date, skills, status,
          created_at, updated_at
        FROM employees 
        WHERE id = $1 AND status = 'active'
      `;
      
      const result = await query(queryText, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in Employee.getById:', error);
      throw error;
    }
  }

  // Create new employee
  static async create(employeeData) {
    try {
      const id = uuidv4();
      const queryText = `
        INSERT INTO employees (
          id, department, cost_center, role, employee_type, location, billing_status,
          hourly_rate, utilization_target, start_date, end_date, skills
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING 
          id, department, cost_center, role, employee_type, location, billing_status,
          hourly_rate, utilization_target, start_date, end_date, skills, status,
          created_at, updated_at
      `;

      const values = [
        id,
        employeeData.department,
        employeeData.costCenter || null,
        employeeData.role,
        employeeData.employeeType,
        employeeData.location,
        employeeData.billingStatus,
        employeeData.hourlyRate || null,
        employeeData.utilizationTarget || 80,
        employeeData.startDate,
        employeeData.endDate || null,
        employeeData.skills || []
      ];

      const result = await query(queryText, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error in Employee.create:', error);
      throw error;
    }
  }

  // Update employee
  static async update(id, updateData) {
    try {
      // Build dynamic UPDATE query
      const updateFields = [];
      const values = [];
      let paramCount = 0;

      // Map of frontend field names to database column names
      const fieldMapping = {
        department: 'department',
        costCenter: 'cost_center',
        role: 'role',
        employeeType: 'employee_type',
        location: 'location',
        billingStatus: 'billing_status',
        hourlyRate: 'hourly_rate',
        utilizationTarget: 'utilization_target',
        startDate: 'start_date',
        endDate: 'end_date',
        skills: 'skills'
      };

      Object.keys(updateData).forEach(key => {
        if (fieldMapping[key] && updateData[key] !== undefined) {
          paramCount++;
          updateFields.push(`${fieldMapping[key]} = $${paramCount}`);
          values.push(updateData[key]);
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      // Add updated_at
      paramCount++;
      updateFields.push(`updated_at = $${paramCount}`);
      values.push(new Date());

      // Add ID parameter
      paramCount++;
      values.push(id);

      const queryText = `
        UPDATE employees 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount} AND status = 'active'
        RETURNING 
          id, department, cost_center, role, employee_type, location, billing_status,
          hourly_rate, utilization_target, start_date, end_date, skills, status,
          created_at, updated_at
      `;

      const result = await query(queryText, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in Employee.update:', error);
      throw error;
    }
  }

  // Soft delete employee
  static async delete(id) {
    try {
      const queryText = `
        UPDATE employees 
        SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND status = 'active'
        RETURNING id
      `;
      
      const result = await query(queryText, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error in Employee.delete:', error);
      throw error;
    }
  }

  // Search employees
  static async search(searchTerm, limit = 10) {
    try {
      const queryText = `
        SELECT 
          id, department, cost_center, role, employee_type, location, billing_status,
          hourly_rate, utilization_target, start_date, end_date, skills, status,
          created_at, updated_at
        FROM employees 
        WHERE status = 'active' AND (
          LOWER(role) LIKE LOWER($1) OR
          LOWER(department) LIKE LOWER($1) OR
          LOWER(location) LIKE LOWER($1) OR
          EXISTS (
            SELECT 1 FROM unnest(skills) AS skill 
            WHERE LOWER(skill) LIKE LOWER($1)
          )
        )
        ORDER BY created_at DESC
        LIMIT $2
      `;

      const result = await query(queryText, [`%${searchTerm}%`, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error in Employee.search:', error);
      throw error;
    }
  }

  // Count employees with filters
  static async count(filters = {}) {
    try {
      let whereClause = "WHERE status = 'active'";
      const queryParams = [];
      let paramCount = 0;

      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          paramCount++;
          if (key === 'skills') {
            whereClause += ` AND $${paramCount} = ANY(skills)`;
          } else {
            whereClause += ` AND LOWER(${key}) LIKE LOWER($${paramCount})`;
          }
          queryParams.push(key === 'skills' ? filters[key] : `%${filters[key]}%`);
        }
      });

      const queryText = `SELECT COUNT(*) as count FROM employees ${whereClause}`;
      const result = await query(queryText, queryParams);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error('Error in Employee.count:', error);
      throw error;
    }
  }

  // Dashboard Statistics
  static async getDashboardStats() {
    try {
      const queryText = `
        SELECT 
          COUNT(*) as total_employees,
          COUNT(*) FILTER (WHERE status = 'active') as active_employees,
          COUNT(*) FILTER (WHERE employee_type = 'Full-time') as fulltime_employees,
          COUNT(*) FILTER (WHERE employee_type = 'Contract') as consultants,
          COUNT(*) FILTER (WHERE billing_status = 'Billable') as billable_employees,
          COUNT(*) FILTER (WHERE billing_status = 'Non-billable') as bench_employees,
          ROUND(AVG(utilization_target), 1) as avg_utilization_target,
          ROUND(AVG(CASE WHEN utilization_target > 0 THEN utilization_target END), 1) as avg_active_utilization
        FROM employees 
        WHERE status = 'active'
      `;
      
      const result = await query(queryText);
      const stats = result.rows[0];
      
      return {
        totalEmployees: {
          count: parseInt(stats.total_employees),
          active: parseInt(stats.active_employees),
          description: 'Total active employees'
        },
        fullTimeEmployees: {
          count: parseInt(stats.fulltime_employees),
          description: 'Permanent staff'
        },
        consultants: {
          count: parseInt(stats.consultants),
          description: 'Contract staff'
        },
        billableEmployees: {
          count: parseInt(stats.billable_employees),
          description: 'Revenue generating'
        },
        benchEmployees: {
          count: parseInt(stats.bench_employees),
          description: 'Awaiting assignment'
        },
        avgUtilization: {
          current: parseFloat(stats.avg_active_utilization) || 0,
          target: 80,
          description: 'Average utilization rate'
        }
      };
    } catch (error) {
      console.error('Error in Employee.getDashboardStats:', error);
      throw error;
    }
  }

  // Employee Analytics
  static async getAnalytics() {
    try {
      const queryText = `
        SELECT 
          department,
          COUNT(*) as employee_count,
          COUNT(*) FILTER (WHERE billing_status = 'Billable') as billable_count,
          ROUND(AVG(utilization_target), 1) as avg_utilization,
          ROUND(AVG(hourly_rate), 2) as avg_hourly_rate
        FROM employees 
        WHERE status = 'active'
        GROUP BY department
        ORDER BY employee_count DESC
      `;
      
      const result = await query(queryText);
      return result.rows.map(row => ({
        department: row.department,
        employeeCount: parseInt(row.employee_count),
        billableCount: parseInt(row.billable_count),
        avgUtilization: parseFloat(row.avg_utilization) || 0,
        avgHourlyRate: parseFloat(row.avg_hourly_rate) || 0
      }));
    } catch (error) {
      console.error('Error in Employee.getAnalytics:', error);
      throw error;
    }
  }

  // Utilization Metrics
  static async getUtilizationMetrics(period = 30) {
    try {
      const queryText = `
        SELECT 
          utilization_target,
          COUNT(*) as employee_count,
          CASE 
            WHEN utilization_target >= 80 THEN 'High'
            WHEN utilization_target >= 60 THEN 'Medium'
            ELSE 'Low'
          END as utilization_category
        FROM employees 
        WHERE status = 'active' AND utilization_target > 0
        GROUP BY utilization_target, utilization_category
        ORDER BY utilization_target DESC
      `;
      
      const result = await query(queryText);
      
      const summary = {
        high: 0,
        medium: 0,
        low: 0,
        total: 0
      };
      
      const details = result.rows.map(row => {
        const count = parseInt(row.employee_count);
        summary.total += count;
        
        if (row.utilization_category === 'High') summary.high += count;
        else if (row.utilization_category === 'Medium') summary.medium += count;
        else summary.low += count;
        
        return {
          utilization: parseInt(row.utilization_target),
          employeeCount: count,
          category: row.utilization_category
        };
      });
      
      return {
        summary,
        details,
        period: `${period} days`
      };
    } catch (error) {
      console.error('Error in Employee.getUtilizationMetrics:', error);
      throw error;
    }
  }

  // Department Breakdown
  static async getDepartmentBreakdown() {
    try {
      const queryText = `
        SELECT 
          department,
          COUNT(*) as total_count,
          COUNT(*) FILTER (WHERE billing_status = 'Billable') as billable_count,
          COUNT(*) FILTER (WHERE billing_status = 'Non-billable') as bench_count,
          ROUND(AVG(utilization_target), 1) as avg_utilization,
          ROUND(AVG(hourly_rate), 2) as avg_rate
        FROM employees 
        WHERE status = 'active'
        GROUP BY department
        ORDER BY total_count DESC
      `;
      
      const result = await query(queryText);
      return result.rows.map(row => ({
        department: row.department,
        totalEmployees: parseInt(row.total_count),
        billableEmployees: parseInt(row.billable_count),
        benchEmployees: parseInt(row.bench_count),
        avgUtilization: parseFloat(row.avg_utilization) || 0,
        avgHourlyRate: parseFloat(row.avg_rate) || 0,
        utilizationRate: row.total_count > 0 ? 
          Math.round((row.billable_count / row.total_count) * 100) : 0
      }));
    } catch (error) {
      console.error('Error in Employee.getDepartmentBreakdown:', error);
      throw error;
    }
  }

  // Skills Distribution
  static async getSkillsDistribution(limit = 10) {
    try {
      const queryText = `
        SELECT 
          skill,
          COUNT(*) as employee_count,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employees WHERE status = 'active'), 1) as percentage
        FROM employees, unnest(skills) as skill
        WHERE status = 'active' AND skills IS NOT NULL
        GROUP BY skill
        ORDER BY employee_count DESC
        LIMIT $1
      `;
      
      const result = await query(queryText, [limit]);
      return result.rows.map(row => ({
        skill: row.skill,
        employeeCount: parseInt(row.employee_count),
        percentage: parseFloat(row.percentage)
      }));
    } catch (error) {
      console.error('Error in Employee.getSkillsDistribution:', error);
      throw error;
    }
  }

  // Recent Activities
  static async getRecentActivities(limit = 10) {
    try {
      const queryText = `
        SELECT 
          id,
          role,
          department,
          employee_type,
          created_at,
          updated_at,
          CASE 
            WHEN created_at = updated_at THEN 'created'
            ELSE 'updated'
          END as activity_type
        FROM employees 
        WHERE status = 'active'
        ORDER BY GREATEST(created_at, updated_at) DESC
        LIMIT $1
      `;
      
      const result = await query(queryText, [limit]);
      return result.rows.map(row => ({
        id: row.id,
        role: row.role,
        department: row.department,
        employeeType: row.employee_type,
        activityType: row.activity_type,
        timestamp: row.activity_type === 'created' ? row.created_at : row.updated_at,
        description: `Employee ${row.activity_type} in ${row.department}`
      }));
    } catch (error) {
      console.error('Error in Employee.getRecentActivities:', error);
      throw error;
    }
  }

  // Location Distribution
  static async getLocationDistribution() {
    try {
      const queryText = `
        SELECT 
          location,
          COUNT(*) as employee_count,
          COUNT(*) FILTER (WHERE billing_status = 'Billable') as billable_count,
          ROUND(AVG(utilization_target), 1) as avg_utilization
        FROM employees 
        WHERE status = 'active'
        GROUP BY location
        ORDER BY employee_count DESC
      `;
      
      const result = await query(queryText);
      return result.rows.map(row => ({
        location: row.location,
        employeeCount: parseInt(row.employee_count),
        billableCount: parseInt(row.billable_count),
        avgUtilization: parseFloat(row.avg_utilization) || 0,
        utilizationRate: row.employee_count > 0 ? 
          Math.round((row.billable_count / row.employee_count) * 100) : 0
      }));
    } catch (error) {
      console.error('Error in Employee.getLocationDistribution:', error);
      throw error;
    }
  }

  // Billing Overview
  static async getBillingOverview() {
    try {
      const queryText = `
        SELECT 
          billing_status,
          COUNT(*) as employee_count,
          ROUND(AVG(hourly_rate), 2) as avg_hourly_rate,
          ROUND(SUM(hourly_rate), 2) as total_hourly_value
        FROM employees 
        WHERE status = 'active' AND hourly_rate > 0
        GROUP BY billing_status
        ORDER BY employee_count DESC
      `;
      
      const result = await query(queryText);
      return result.rows.map(row => ({
        billingStatus: row.billing_status,
        employeeCount: parseInt(row.employee_count),
        avgHourlyRate: parseFloat(row.avg_hourly_rate) || 0,
        totalHourlyValue: parseFloat(row.total_hourly_value) || 0
      }));
    } catch (error) {
      console.error('Error in Employee.getBillingOverview:', error);
      throw error;
    }
  }

  // Employee Type Distribution
  static async getEmployeeTypeDistribution() {
    try {
      const queryText = `
        SELECT 
          employee_type,
          COUNT(*) as employee_count,
          ROUND(AVG(utilization_target), 1) as avg_utilization,
          COUNT(*) FILTER (WHERE billing_status = 'Billable') as billable_count
        FROM employees 
        WHERE status = 'active'
        GROUP BY employee_type
        ORDER BY employee_count DESC
      `;
      
      const result = await query(queryText);
      return result.rows.map(row => ({
        employeeType: row.employee_type,
        employeeCount: parseInt(row.employee_count),
        avgUtilization: parseFloat(row.avg_utilization) || 0,
        billableCount: parseInt(row.billable_count),
        billableRate: row.employee_count > 0 ? 
          Math.round((row.billable_count / row.employee_count) * 100) : 0
      }));
    } catch (error) {
      console.error('Error in Employee.getEmployeeTypeDistribution:', error);
      throw error;
    }
  }

  // Bench Analysis
  static async getBenchAnalysis() {
    try {
      const queryText = `
        SELECT 
          id,
          role,
          department,
          location,
          skills,
          utilization_target,
          start_date,
          EXTRACT(days FROM (CURRENT_DATE - start_date)) as days_since_start
        FROM employees 
        WHERE status = 'active' AND billing_status = 'Non-billable'
        ORDER BY start_date ASC
      `;
      
      const result = await query(queryText);
      
      const benchEmployees = result.rows.map(row => ({
        id: row.id,
        role: row.role,
        department: row.department,
        location: row.location,
        skills: row.skills || [],
        utilizationTarget: parseInt(row.utilization_target) || 0,
        daysSinceStart: parseInt(row.days_since_start) || 0,
        benchDuration: parseInt(row.days_since_start) || 0
      }));
      
      const summary = {
        totalBenchEmployees: benchEmployees.length,
        avgBenchDuration: benchEmployees.length > 0 ? 
          Math.round(benchEmployees.reduce((sum, emp) => sum + emp.benchDuration, 0) / benchEmployees.length) : 0,
        longTermBench: benchEmployees.filter(emp => emp.benchDuration > 90).length,
        recentBench: benchEmployees.filter(emp => emp.benchDuration <= 30).length
      };
      
      return {
        summary,
        employees: benchEmployees
      };
    } catch (error) {
      console.error('Error in Employee.getBenchAnalysis:', error);
      throw error;
    }
  }

  // Get unique values for dropdown filters
  static async getUniqueValues(field) {
    try {
      const fieldMapping = {
        departments: 'department',
        locations: 'location',
        employeeTypes: 'employee_type',
        billingStatuses: 'billing_status'
      };

      const dbField = fieldMapping[field];
      if (!dbField) {
        throw new Error('Invalid field for unique values');
      }

      const queryText = `
        SELECT DISTINCT ${dbField} as value 
        FROM employees 
        WHERE status = 'active' AND ${dbField} IS NOT NULL
        ORDER BY ${dbField}
      `;

      const result = await query(queryText);
      return result.rows.map(row => row.value);
    } catch (error) {
      console.error('Error in Employee.getUniqueValues:', error);
      throw error;
    }
  }
}

module.exports = Employee;