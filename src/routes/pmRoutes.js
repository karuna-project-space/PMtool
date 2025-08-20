const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { generateResponse } = require('../utils/responseHelper');

class PMController {
  // Get PM Dashboard Overview
  async getDashboardOverview(req, res, next) {
    try {
      // Get data from existing employee analytics
      const [
        dashboardStats,
        departmentBreakdown,
        utilizationMetrics,
        benchAnalysis
      ] = await Promise.all([
        Employee.getDashboardStats(),
        Employee.getDepartmentBreakdown(),
        Employee.getUtilizationMetrics(30),
        Employee.getBenchAnalysis()
      ]);

      // Calculate project-like metrics from employee data
      const projectMetrics = this.calculateProjectMetrics(departmentBreakdown);
      
      const pmDashboard = {
        revenue: {
          inr: '₹5,41,12,500',
          usd: '$650,000',
          growth: '+12.5%'
        },
        profit: {
          inr: '₹1,24,87,500',
          usd: '$150,000',
          margin: '23.1%'
        },
        utilization: {
          current: dashboardStats.avgUtilization.current,
          target: dashboardStats.avgUtilization.target,
          status: dashboardStats.avgUtilization.current >= 80 ? 'good' : 'alert'
        },
        activeProjects: projectMetrics.activeProjects,
        recentProjects: projectMetrics.projects,
        resourceAlerts: this.generateResourceAlerts(benchAnalysis, utilizationMetrics),
        summary: {
          totalEmployees: dashboardStats.totalEmployees.count,
          billableEmployees: dashboardStats.billableEmployees.count,
          benchEmployees: dashboardStats.benchEmployees.count,
          departments: departmentBreakdown.length
        }
      };

      res.status(200).json(generateResponse(
        true,
        'PM Dashboard data retrieved successfully',
        pmDashboard
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get Projects Data
  async getProjectsData(req, res, next) {
    try {
      const departmentBreakdown = await Employee.getDepartmentBreakdown();
      
      const projects = departmentBreakdown.map((dept, index) => ({
        id: index + 1,
        name: `Project ${String.fromCharCode(65 + index)}`, // Project A, B, C, etc.
        department: dept.department,
        profit: this.calculateDepartmentProfit(dept),
        status: 'active',
        team: dept.totalEmployees,
        utilization: dept.avgUtilization,
        billableEmployees: dept.billableEmployees,
        startDate: '2024-01-15', // Mock date
        estimatedCompletion: '2024-12-31'
      }));

      res.status(200).json(generateResponse(
        true,
        'Projects data retrieved successfully',
        { projects }
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get Resources Data
  async getResourcesData(req, res, next) {
    try {
      const [
        dashboardStats,
        departmentBreakdown,
        locationDistribution,
        skillsDistribution
      ] = await Promise.all([
        Employee.getDashboardStats(),
        Employee.getDepartmentBreakdown(),
        Employee.getLocationDistribution(),
        Employee.getSkillsDistribution(10)
      ]);

      const resourcesData = {
        overview: {
          totalResources: dashboardStats.totalEmployees.count,
          billableResources: dashboardStats.billableEmployees.count,
          benchResources: dashboardStats.benchEmployees.count,
          avgUtilization: dashboardStats.avgUtilization.current
        },
        byDepartment: departmentBreakdown,
        byLocation: locationDistribution,
        topSkills: skillsDistribution,
        utilizationBreakdown: {
          optimal: departmentBreakdown.filter(d => d.avgUtilization >= 75 && d.avgUtilization <= 85).length,
          underutilized: departmentBreakdown.filter(d => d.avgUtilization < 75).length,
          overutilized: departmentBreakdown.filter(d => d.avgUtilization > 85).length
        }
      };

      res.status(200).json(generateResponse(
        true,
        'Resources data retrieved successfully',
        resourcesData
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get Bench Report
  async getBenchReport(req, res, next) {
    try {
      const benchAnalysis = await Employee.getBenchAnalysis();
      
      const benchReport = {
        summary: benchAnalysis.summary,
        employees: benchAnalysis.employees,
        costAnalysis: {
          monthlyCost: benchAnalysis.summary.totalBenchEmployees * 5000, // $5k per employee
          annualCost: benchAnalysis.summary.totalBenchEmployees * 60000,
          potentialSavings: benchAnalysis.summary.longTermBench * 2000
        },
        recommendations: this.generateBenchRecommendations(benchAnalysis)
      };

      res.status(200).json(generateResponse(
        true,
        'Bench report retrieved successfully',
        benchReport
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get Currency Data
  async getCurrencyData(req, res, next) {
    try {
      // Mock currency data - in real app, this would come from a currency API
      const currencyData = {
        baseCurrency: 'USD',
        rates: {
          'USD': 1.0,
          'INR': 83.25,
          'EUR': 0.85,
          'GBP': 0.79,
          'CAD': 1.35,
          'AUD': 1.52
        },
        lastUpdated: new Date().toISOString(),
        projectCurrencies: [
          { project: 'Project Alpha', currency: 'USD', amount: 130000 },
          { project: 'Project Beta', currency: 'INR', amount: 1665000 }
        ],
        totalRevenue: {
          USD: 650000,
          INR: 54112500,
          EUR: 552500,
          GBP: 513500
        }
      };

      res.status(200).json(generateResponse(
        true,
        'Currency data retrieved successfully',
        currencyData
      ));
    } catch (error) {
      next(error);
    }
  }

  // Helper Methods
  calculateProjectMetrics(departmentBreakdown) {
    const projects = departmentBreakdown.slice(0, 2).map((dept, index) => ({
      id: index + 1,
      name: `Project ${index === 0 ? 'Alpha' : 'Beta'}`,
      profit: this.calculateDepartmentProfit(dept),
      status: 'active',
      department: dept.department,
      team: dept.totalEmployees
    }));

    return {
      activeProjects: projects.length,
      projects: projects
    };
  }

  calculateDepartmentProfit(dept) {
    // Mock calculation based on department metrics
    const baseProfit = dept.billableEmployees * dept.avgHourlyRate * 160; // 160 hours/month
    return `$${Math.round(baseProfit).toLocaleString()}`;
  }

  generateResourceAlerts(benchAnalysis, utilizationMetrics) {
    const alerts = [];

    if (benchAnalysis.summary.totalBenchEmployees > 0) {
      alerts.push({
        type: 'warning',
        title: 'Underutilized Resources',
        description: `${benchAnalysis.summary.totalBenchEmployees} resources on bench`,
        icon: 'fas fa-exclamation-triangle',
        priority: 'medium'
      });
    }

    if (utilizationMetrics.summary.high < utilizationMetrics.summary.total * 0.6) {
      alerts.push({
        type: 'danger',
        title: 'Low Utilization Alert',
        description: 'Overall utilization below target',
        icon: 'fas fa-exclamation-circle',
        priority: 'high'
      });
    }

    if (benchAnalysis.summary.longTermBench > 0) {
      alerts.push({
        type: 'danger',
        title: 'Long-term Bench',
        description: `${benchAnalysis.summary.longTermBench} resources on bench >90 days`,
        icon: 'fas fa-clock',
        priority: 'high'
      });
    }

    return alerts;
  }

  generateBenchRecommendations(benchAnalysis) {
    const recommendations = [];

    if (benchAnalysis.summary.totalBenchEmployees > 0) {
      recommendations.push({
        title: 'Immediate Actions',
        items: [
          'Review upcoming project requirements',
          'Consider training programs for bench resources',
          'Explore internal project opportunities'
        ]
      });
    }

    if (benchAnalysis.summary.longTermBench > 0) {
      recommendations.push({
        title: 'Long-term Strategy',
        items: [
          'Evaluate skill gaps and training needs',
          'Consider role transitions or upskilling',
          'Review resource allocation strategy'
        ]
      });
    }

    return recommendations;
  }
}

const pmController = new PMController();

// PM Dashboard Routes
router.get('/dashboard', pmController.getDashboardOverview.bind(pmController));
router.get('/projects', pmController.getProjectsData.bind(pmController));
router.get('/resources', pmController.getResourcesData.bind(pmController));
router.get('/bench-report', pmController.getBenchReport.bind(pmController));
router.get('/currency', pmController.getCurrencyData.bind(pmController));

module.exports = router;