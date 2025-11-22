const { ActivityLog, User } = require('../models');
const { Op } = require('sequelize');

// Get all activity logs with filters
const getAllActivityLogs = async (req, res) => {
  try {
    const {
      user_id,
      method,
      endpoint,
      date_from,
      date_to,
      page = 1,
      limit = 50,
    } = req.query;

    const where = {};

    // Filters
    if (user_id) where.user_id = user_id;
    if (method) where.method = method;
    if (endpoint) where.endpoint = { [Op.like]: `%${endpoint}%` };

    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) where.created_at[Op.lte] = new Date(date_to);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ActivityLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error getting activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get activity logs',
      error: error.message,
    });
  }
};

// Get activity log by ID
const getActivityLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const activityLog = await ActivityLog.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email', 'full_name'],
        },
      ],
    });

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        message: 'Activity log not found',
      });
    }

    res.json({
      success: true,
      data: activityLog,
    });
  } catch (error) {
    console.error('Error getting activity log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get activity log',
      error: error.message,
    });
  }
};

// Get activity logs by user
const getActivityLogsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await ActivityLog.findAndCountAll({
      where: { user_id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error getting user activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user activity logs',
      error: error.message,
    });
  }
};

// Get activity statistics
const getActivityStats = async (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    const where = {};
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) where.created_at[Op.lte] = new Date(date_to);
    }

    // Get total logs
    const totalLogs = await ActivityLog.count({ where });

    // Get logs by method
    const logsByMethod = await ActivityLog.findAll({
      where,
      attributes: [
        'method',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      ],
      group: ['method'],
      raw: true,
    });

    // Get logs by status code range
    const logsByStatus = await ActivityLog.findAll({
      where,
      attributes: [
        'response_status',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      ],
      group: ['response_status'],
      raw: true,
    });

    // Get most active users
    const mostActiveUsers = await ActivityLog.findAll({
      where,
      attributes: [
        'user_id',
        [require('sequelize').fn('COUNT', require('sequelize').col('ActivityLog.id')), 'count'],
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      group: ['user_id', 'user.id'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('ActivityLog.id')), 'DESC']],
      limit: 10,
    });

    // Get most accessed endpoints
    const mostAccessedEndpoints = await ActivityLog.findAll({
      where,
      attributes: [
        'endpoint',
        'method',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      ],
      group: ['endpoint', 'method'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    // Get average response time
    const avgResponseTime = await ActivityLog.findOne({
      where,
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('response_time')), 'average'],
      ],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        totalLogs,
        logsByMethod,
        logsByStatus,
        mostActiveUsers,
        mostAccessedEndpoints,
        averageResponseTime: Math.round(avgResponseTime.average || 0),
      },
    });
  } catch (error) {
    console.error('Error getting activity stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get activity stats',
      error: error.message,
    });
  }
};

// Delete old logs (cleanup)
const deleteOldLogs = async (req, res) => {
  try {
    const { days = 90 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const deletedCount = await ActivityLog.destroy({
      where: {
        created_at: {
          [Op.lt]: cutoffDate,
        },
      },
    });

    res.json({
      success: true,
      message: `Deleted ${deletedCount} logs older than ${days} days`,
      deletedCount,
    });
  } catch (error) {
    console.error('Error deleting old logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete old logs',
      error: error.message,
    });
  }
};

module.exports = {
  getAllActivityLogs,
  getActivityLogById,
  getActivityLogsByUser,
  getActivityStats,
  deleteOldLogs,
};
