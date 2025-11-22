const { ActivityLog } = require('../models');

// Helper to get action description based on method and endpoint
const getActionDescription = (method, endpoint) => {
  const actions = {
    GET: 'View',
    POST: 'Create',
    PUT: 'Update',
    PATCH: 'Update',
    DELETE: 'Delete',
  };

  const resource = endpoint.split('/').filter(Boolean).pop() || 'resource';
  return `${actions[method] || method} ${resource}`;
};

// Helper to get client IP address
const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress ||
    'unknown'
  );
};

// Helper to sanitize sensitive data from request body
const sanitizeRequestBody = (body, method) => {
  if (!body || Object.keys(body).length === 0) return null;

  // Don't log sensitive fields
  const sensitiveFields = ['password', 'token', 'api_key', 'secret', 'access_token', 'refresh_token'];
  const sanitized = { ...body };

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = '***HIDDEN***';
    }
  });

  return sanitized;
};

const activityLogger = async (req, res, next) => {
  // Skip logging for health check and static files
  const skipPaths = ['/api/health', '/api/db-test', '/favicon.ico'];
  if (skipPaths.some((path) => req.path.includes(path))) {
    return next();
  }

  const startTime = Date.now();

  // Capture request information (without user_id yet)
  const logData = {
    method: req.method,
    endpoint: req.originalUrl || req.url,
    ip_address: getClientIp(req),
    user_agent: req.headers['user-agent'],
    action: getActionDescription(req.method, req.path),
    request_body: sanitizeRequestBody(req.body, req.method),
    query_params: Object.keys(req.query).length > 0 ? req.query : null,
  };

  // Store original res.json function
  const originalJson = res.json;
  let responseLogged = false;

  // Override res.json to capture response
  res.json = function (data) {
    if (!responseLogged) {
      responseLogged = true;
      const responseTime = Date.now() - startTime;

      // Save log to database asynchronously
      // Get user_id at response time (after authenticate middleware has run)
      ActivityLog.create({
        ...logData,
        user_id: req.user?.id || null,
        response_status: res.statusCode,
        response_time: responseTime,
        error_message: res.statusCode >= 400 && data?.error ? data.error : null,
      }).catch((error) => {
        console.error('Failed to save activity log:', error);
      });
    }

    // Call original res.json
    return originalJson.call(this, data);
  };

  // Handle response end (for non-JSON responses)
  res.on('finish', () => {
    if (!responseLogged) {
      responseLogged = true;
      const responseTime = Date.now() - startTime;

      // Get user_id at response time (after authenticate middleware has run)
      ActivityLog.create({
        ...logData,
        user_id: req.user?.id || null,
        response_status: res.statusCode,
        response_time: responseTime,
      }).catch((error) => {
        console.error('Failed to save activity log:', error);
      });
    }
  });

  next();
};

module.exports = activityLogger;
