const { Op } = require('sequelize');

/**
 * Build pagination options from query parameters
 * @param {Object} query - Express request query object
 * @returns {Object} - Sequelize pagination options
 */
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  return {
    limit,
    offset,
    page,
  };
};

/**
 * Build sorting options from query parameters
 * @param {Object} query - Express request query object
 * @param {String} defaultSort - Default sort field
 * @returns {Array} - Sequelize order array
 */
const getSortingParams = (query, defaultSort = 'id') => {
  const sortBy = query.sortBy || defaultSort;
  const sortOrder = query.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  return [[sortBy, sortOrder]];
};

/**
 * Build search options for multiple fields
 * @param {String} searchTerm - Search term from query
 * @param {Array} searchFields - Array of field names to search
 * @returns {Object} - Sequelize where clause
 */
const getSearchParams = (searchTerm, searchFields = []) => {
  if (!searchTerm || searchFields.length === 0) {
    return {};
  }

  const searchConditions = searchFields.map((field) => ({
    [field]: {
      [Op.iLike]: `%${searchTerm}%`,
    },
  }));

  return {
    [Op.or]: searchConditions,
  };
};

/**
 * Build filter options from query parameters
 * @param {Object} query - Express request query object
 * @param {Array} allowedFilters - Array of allowed filter field names
 * @returns {Object} - Sequelize where clause
 */
const getFilterParams = (query, allowedFilters = []) => {
  const filters = {};

  allowedFilters.forEach((filter) => {
    if (query[filter] !== undefined && query[filter] !== '') {
      // Handle boolean values
      if (query[filter] === 'true') {
        filters[filter] = true;
      } else if (query[filter] === 'false') {
        filters[filter] = false;
      } else if (!isNaN(query[filter])) {
        // Handle numeric values
        filters[filter] = Number(query[filter]);
      } else {
        // Handle string values
        filters[filter] = query[filter];
      }
    }
  });

  return filters;
};

/**
 * Build date range filter
 * @param {Object} query - Express request query object
 * @param {String} fieldName - Name of the date field
 * @returns {Object} - Sequelize where clause for date range
 */
const getDateRangeParams = (query, fieldName) => {
  const dateFilter = {};
  const startDateKey = `${fieldName}Start`;
  const endDateKey = `${fieldName}End`;

  if (query[startDateKey] || query[endDateKey]) {
    dateFilter[fieldName] = {};

    if (query[startDateKey]) {
      dateFilter[fieldName][Op.gte] = new Date(query[startDateKey]);
    }

    if (query[endDateKey]) {
      dateFilter[fieldName][Op.lte] = new Date(query[endDateKey]);
    }
  }

  return dateFilter;
};

/**
 * Format paginated response
 * @param {Array} data - Data array
 * @param {Number} total - Total count
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} - Formatted response with pagination meta
 */
const formatPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Build complete query options for Sequelize
 * @param {Object} req - Express request object
 * @param {Object} options - Configuration options
 * @param {Array} options.searchFields - Fields to search in
 * @param {Array} options.allowedFilters - Allowed filter fields
 * @param {String} options.defaultSort - Default sort field
 * @param {Array} options.dateFields - Date fields for range filtering
 * @returns {Object} - Complete Sequelize query options
 */
const buildQueryOptions = (req, options = {}) => {
  const {
    searchFields = [],
    allowedFilters = [],
    defaultSort = 'id',
    dateFields = [],
  } = options;

  const { limit, offset, page } = getPaginationParams(req.query);
  const order = getSortingParams(req.query, defaultSort);

  // Build where clause
  const where = {
    ...getSearchParams(req.query.search, searchFields),
    ...getFilterParams(req.query, allowedFilters),
  };

  // Add date range filters
  dateFields.forEach((field) => {
    Object.assign(where, getDateRangeParams(req.query, field));
  });

  return {
    where,
    limit,
    offset,
    order,
    page, // Not used by Sequelize, but useful for response
  };
};

module.exports = {
  getPaginationParams,
  getSortingParams,
  getSearchParams,
  getFilterParams,
  getDateRangeParams,
  formatPaginatedResponse,
  buildQueryOptions,
};
