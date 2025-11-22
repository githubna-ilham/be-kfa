const express = require('express');
const router = express.Router();
const {
  getAllUnitKerja,
  getUnitKerjaById,
  createUnitKerja,
  updateUnitKerja,
  deleteUnitKerja,
} = require('../controllers/unitKerjaController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllUnitKerja);
router.get('/:id', getUnitKerjaById);
router.post('/', createUnitKerja);
router.put('/:id', updateUnitKerja);
router.delete('/:id', deleteUnitKerja);

module.exports = router;
