const express = require('express');
const router = express.Router();
const {
  getAllSatuan,
  getSatuanById,
  createSatuan,
  updateSatuan,
  deleteSatuan,
} = require('../controllers/satuanController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllSatuan);
router.get('/:id', getSatuanById);
router.post('/', createSatuan);
router.put('/:id', updateSatuan);
router.delete('/:id', deleteSatuan);

module.exports = router;
