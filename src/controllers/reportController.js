const Employee = require('../models/Employee');
const { generateResponse } = require('../utils/responseHelper');
const { generatePDFReport, generateExcelReport } = require('../utils/reportHelper');

class ReportController {
  // Generate comprehensive HR analytics report
  async generateHRAnalyticsReport(req, res, next) {
    try {
      const { 
        format = 'pdf', 
        reportType = 'comprehensive',
        dateRange = '30',
        includeCharts = true,
        departments,
        locations
      } = req.query;

      // Collect all data for the report
      const reportData = await this.collectReportData(dateRange, departments, locations);
      
      let reportBuffer;
      let contentType;
      let filename;

      if (format.toLowerCase() === 'excel') {
        reportBuffer = await generateExcelReport(reportData, reportType);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = `HR_Analytics_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else {
        // Default to PDF
        reportBuffer = await generatePDFReport(reportData, reportType, includeCharts);
        contentType = 'application/pdf';
        filename = `HR_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', reportBuffer.length);
      
      return res.send(reportBuffer);

    } catch (error) {
      next(error);
    }
  }

  // Generate specific report types
  async generateSpecificReport(req, res, next) {
    try {
      const { reportType } = req.params;
      const { format = 'pdf', dateRange = '30' } = req.query;

      let reportData;
      let reportTitle;

      switch (reportType) {
        case 'utilization':
          reportData = await this.getUtilizationReportData(dateRange);
          reportTitle = 'Employee Utilization Report';
          break;
        case 'department':
          reportData = await this.getDepartmentReportData();
          reportTitle = 'Department Analysis Report';
          break;
        case 'bench':
          reportData = await this.getBenchReportData();
          reportTitle = 'Bench Analysis Report';
          break;
        case 'skills':
          reportData = await this.getSkillsReportData();
          reportTitle = 'Skills Distribution Report';
          break;
        case 'billing':
          reportData = await this.getBillingReportData();
          reportTitle = 'Billing Overview Report';
          break;
        default:
          return res.status(400).json(generateResponse(false, 'Invalid report type'));
      }

      let reportBuffer;
      let contentType;
      let filename;

      if (format.toLowerCase() === 'excel') {
        reportBuffer = await generateExcelReport({ [reportType]: reportData }, reportType);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        filename = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else {
        reportBuffer = await generatePDFReport({ [reportType]: reportData, title: reportTitle }, reportType);
        contentType = 'application/pdf';
        filename = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', reportBuffer.length);
      
      return res.send(reportBuffer);

    } catch (error) {
      next(error);
    }
  }

  // Get available report types
  async getReportTypes(req, res, next) {
    try {
      const reportTypes = [
        {
          id: 'comprehensive',
          name: 'Comprehensive HR Analytics',
          description: 'Complete overview of all HR metrics and analytics',
          formats: ['pdf', 'excel']
        },
        {
          id: 'utilization',
          name: 'Employee Utilization Report',
          description: 'Detailed analysis of employee utilization rates',
          formats: ['pdf', 'excel']
        },
        {
          id: 'department',
          name: 'Department Analysis',
          description: 'Department-wise breakdown and performance metrics',
          formats: ['pdf', 'excel']
        },
        {
          id: 'bench',
          name: 'Bench Analysis',
          description: 'Analysis of non-billable employees and bench time',
          formats: ['pdf', 'excel']
        },
        {
          id: 'skills',
          name: 'Skills Distribution',
          description: 'Overview of skills across the organization',
          formats: ['pdf', 'excel']
        },
        {
          id: 'billing',
          name: 'Billing Overview',
          description: 'Billing status and revenue analysis',
          formats: ['pdf', 'excel']
        }
      ];

      res.status(200).json(generateResponse(
        true,
        'Report types retrieved successfully',
        { reportTypes }
      ));

    } catch (error) {
      next(error);
    }
  }

  // Get report preview data
  async getReportPreview(req, res, next) {
    try {
      const { reportType = 'comprehensive', dateRange = '30' } = req.query;
      
      const reportData = await this.collectReportData(dateRange);
      
      // Create a preview with summary data
      const preview = {
        reportType,
        generatedAt: new Date().toISOString(),
        dateRange: `${dateRange} days`,
        summary: {
          totalEmployees: reportData.overview.totalEmployees.count,
          departments: reportData.departments.length,
          locations: reportData.locations.length,
          avgUtilization: reportData.overview.avgUtilization.current
        },
        sections: this.getReportSections(reportType),
        estimatedPages: this.estimateReportPages(reportData, reportType)
      };

      res.status(200).json(generateResponse(
        true,
        'Report preview generated successfully',
        preview
      ));

    } catch (error) {
      next(error);
    }
  }

  // Collect all data needed for reports
  async collectReportData(dateRange, departments, locations) {
    const filters = {};
    if (departments) filters.department = departments;
    if (locations) filters.location = locations;

    const [
      overview,
      analytics,
      utilization,
      departmentBreakdown,
      skillsDistribution,
      recentActivities,
      locationDistribution,
      billingOverview,
      employeeTypes,
      benchAnalysis
    ] = await Promise.all([
      Employee.getDashboardStats(),
      Employee.getAnalytics(),
      Employee.getUtilizationMetrics(parseInt(dateRange)),
      Employee.getDepartmentBreakdown(),
      Employee.getSkillsDistribution(15),
      Employee.getRecentActivities(20),
      Employee.getLocationDistribution(),
      Employee.getBillingOverview(),
      Employee.getEmployeeTypeDistribution(),
      Employee.getBenchAnalysis()
    ]);

    return {
      overview,
      analytics,
      utilization,
      departments: departmentBreakdown,
      skills: skillsDistribution,
      activities: recentActivities,
      locations: locationDistribution,
      billing: billingOverview,
      employeeTypes,
      bench: benchAnalysis,
      generatedAt: new Date().toISOString(),
      dateRange: `${dateRange} days`,
      filters
    };
  }

  // Get specific report data methods
  async getUtilizationReportData(dateRange) {
    return await Employee.getUtilizationMetrics(parseInt(dateRange));
  }

  async getDepartmentReportData() {
    return await Employee.getDepartmentBreakdown();
  }

  async getBenchReportData() {
    return await Employee.getBenchAnalysis();
  }

  async getSkillsReportData() {
    return await Employee.getSkillsDistribution(20);
  }

  async getBillingReportData() {
    return await Employee.getBillingOverview();
  }

  // Helper methods
  getReportSections(reportType) {
    const sections = {
      comprehensive: [
        'Executive Summary',
        'Employee Overview',
        'Department Analysis',
        'Utilization Metrics',
        'Skills Distribution',
        'Location Analysis',
        'Billing Overview',
        'Bench Analysis',
        'Recent Activities',
        'Recommendations'
      ],
      utilization: [
        'Utilization Summary',
        'Department Utilization',
        'Individual Performance',
        'Trends Analysis',
        'Recommendations'
      ],
      department: [
        'Department Overview',
        'Performance Metrics',
        'Resource Allocation',
        'Utilization by Department',
        'Recommendations'
      ],
      bench: [
        'Bench Summary',
        'Bench Duration Analysis',
        'Skills Available',
        'Cost Analysis',
        'Action Items'
      ],
      skills: [
        'Skills Overview',
        'Skills by Department',
        'Skills Gap Analysis',
        'Training Recommendations'
      ],
      billing: [
        'Billing Summary',
        'Revenue Analysis',
        'Billing Efficiency',
        'Cost Centers',
        'Optimization Opportunities'
      ]
    };

    return sections[reportType] || sections.comprehensive;
  }

  estimateReportPages(data, reportType) {
    // Simple estimation based on data size and report type
    const basePages = {
      comprehensive: 8,
      utilization: 4,
      department: 3,
      bench: 3,
      skills: 2,
      billing: 3
    };

    const dataMultiplier = Math.ceil(data.departments.length / 5);
    return (basePages[reportType] || 5) + dataMultiplier;
  }
}

module.exports = new ReportController();