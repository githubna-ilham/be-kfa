const express = require('express');
const router = express.Router();
const {
  getAllTransaksi,
  getTransaksiById,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
} = require('../controllers/transaksiController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllTransaksi);
router.get('/:id', getTransaksiById);
router.post('/', createTransaksi);
router.put('/:id', updateTransaksi);
router.delete('/:id', deleteTransaksi);

module.exports = router;
