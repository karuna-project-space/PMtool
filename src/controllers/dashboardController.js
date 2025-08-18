const Employee = require('../models/Employee');
const { generateResponse } = require('../utils/responseHelper');

class DashboardController {
  // Get dashboard overview statistics
  async getDashboardOverview(req, res, next) {
    try {
      const stats = await Employee.getDashboardStats();
      
      res.status(200).json(generateResponse(
        true, 
        'Dashboard overview retrieved successfully', 
        stats
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get employee analytics data
  async getEmployeeAnalytics(req, res, next) {
    try {
      const analytics = await Employee.getAnalytics();
      
      res.status(200).json(generateResponse(
        true, 
        'Employee analytics retrieved successfully', 
        analytics
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get utilization metrics
  async getUtilizationMetrics(req, res, next) {
    try {
      const { period = '30' } = req.query; // days
      const metrics = await Employee.getUtilizationMetrics(parseInt(period));
      
      res.status(200).json(generateResponse(
        true, 
        'Utilization metrics retrieved successfully', 
        metrics
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get department breakdown
  async getDepartmentBreakdown(req, res, next) {
    try {
      const breakdown = await Employee.getDepartmentBreakdown();
      
      res.status(200).json(generateResponse(
        true, 
        'Department breakdown retrieved successfully', 
        breakdown
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get skills distribution
  async getSkillsDistribution(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const distribution = await Employee.getSkillsDistribution(parseInt(limit));
      
      res.status(200).json(generateResponse(
        true, 
        'Skills distribution retrieved successfully', 
        distribution
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get recent activities (for notifications/updates)
  async getRecentActivities(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const activities = await Employee.getRecentActivities(parseInt(limit));
      
      res.status(200).json(generateResponse(
        true, 
        'Recent activities retrieved successfully', 
        activities
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get location-wise employee distribution
  async getLocationDistribution(req, res, next) {
    try {
      const distribution = await Employee.getLocationDistribution();
      
      res.status(200).json(generateResponse(
        true, 
        'Location distribution retrieved successfully', 
        distribution
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get billing status overview
  async getBillingOverview(req, res, next) {
    try {
      const overview = await Employee.getBillingOverview();
      
      res.status(200).json(generateResponse(
        true, 
        'Billing overview retrieved successfully', 
        overview
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get employee type distribution
  async getEmployeeTypeDistribution(req, res, next) {
    try {
      const distribution = await Employee.getEmployeeTypeDistribution();
      
      res.status(200).json(generateResponse(
        true, 
        'Employee type distribution retrieved successfully', 
        distribution
      ));
    } catch (error) {
      next(error);
    }
  }

  // Get bench time analysis
  async getBenchAnalysis(req, res, next) {
    try {
      const analysis = await Employee.getBenchAnalysis();
      
      res.status(200).json(generateResponse(
        true, 
        'Bench analysis retrieved successfully', 
        analysis
      ));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();