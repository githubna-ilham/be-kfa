const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Dashboard summary - main overview data
router.get('/summary', dashboardController.getDashboardSummary);

// Sales chart data (daily/weekly/monthly)
router.get('/sales-chart', dashboardController.getSalesChart);

// Top selling products
router.get('/top-products', dashboardController.getTopProducts);

// Low stock alerts
router.get('/low-stock', dashboardController.getLowStockAlerts);

// Expiring medicines
router.get('/expiring', dashboardController.getExpiringMedicines);

// Recent transactions
router.get('/recent-transactions', dashboardController.getRecentTransactions);

// Payment method statistics
router.get('/payment-stats', dashboardController.getPaymentMethodStats);

module.exports = router;
