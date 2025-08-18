const Joi = require('joi');
const { generateResponse } = require('../utils/responseHelper');

const employeeSchema = Joi.object({
  // Organizational Information (Required fields)
  department: Joi.string().required().min(2).max(100).messages({
    'string.empty': 'Department is required',
    'string.min': 'Department must be at least 2 characters long',
    'string.max': 'Department cannot exceed 100 characters'
  }),
  
  costCenter: Joi.string().allow('').max(50),
  
  role: Joi.string().required().min(2).max(100).messages({
    'string.empty': 'Role is required',
    'string.min': 'Role must be at least 2 characters long',
    'string.max': 'Role cannot exceed 100 characters'
  }),
  
  employeeType: Joi.string().required().valid('Full-time', 'Part-time', 'Contract', 'Intern').messages({
    'string.empty': 'Employee type is required',
    'any.only': 'Employee type must be one of: Full-time, Part-time, Contract, Intern'
  }),
  
  location: Joi.string().required().min(2).max(100).messages({
    'string.empty': 'Location is required',
    'string.min': 'Location must be at least 2 characters long',
    'string.max': 'Location cannot exceed 100 characters'
  }),
  
  billingStatus: Joi.string().required().valid('Billable', 'Non-billable', 'Overhead').messages({
    'string.empty': 'Billing status is required',
    'any.only': 'Billing status must be one of: Billable, Non-billable, Overhead'
  }),

  // Professional Details
  hourlyRate: Joi.number().positive().precision(2).max(1000).messages({
    'number.positive': 'Hourly rate must be a positive number',
    'number.max': 'Hourly rate cannot exceed $1000'
  }),
  
  utilizationTarget: Joi.number().integer().min(0).max(100).default(80).messages({
    'number.min': 'Utilization target cannot be less than 0%',
    'number.max': 'Utilization target cannot exceed 100%'
  }),
  
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Start date must be a valid date',
    'date.format': 'Start date must be in ISO format (YYYY-MM-DD)',
    'any.required': 'Start date is required'
  }),
  
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).allow(null, '').messages({
    'date.base': 'End date must be a valid date',
    'date.format': 'End date must be in ISO format (YYYY-MM-DD)',
    'date.greater': 'End date must be after start date'
  }),

  // Additional Information
  skills: Joi.array().items(Joi.string().min(1).max(50)).max(20).default([]).messages({
    'array.max': 'Cannot have more than 20 skills',
    'string.min': 'Each skill must be at least 1 character long',
    'string.max': 'Each skill cannot exceed 50 characters'
  })
});

const validateEmployee = (req, res, next) => {
  // Convert skills from comma-separated string to array if needed
  if (req.body.skills && typeof req.body.skills === 'string') {
    req.body.skills = req.body.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  }

  const { error, value } = employeeSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json(generateResponse(false, 'Validation failed', {
      errors: validationErrors
    }));
  }

  req.body = value;
  next();
};

module.exports = {
  validateEmployee,
  employeeSchema
};