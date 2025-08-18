/**
 * Generate standardized API response
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {any} data - Response data (optional)
 * @returns {object} Standardized response object
 */
const generateResponse = (success, message, data = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

/**
 * Generate paginated response
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {array} items - Array of items
 * @param {object} pagination - Pagination info
 * @returns {object} Standardized paginated response
 */
const generatePaginatedResponse = (success, message, items, pagination) => {
  return {
    success,
    message,
    data: {
      items,
      pagination
    },
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  generateResponse,
  generatePaginatedResponse
};