const express = require('express');
const router = express.Router();
const {
  getAllPembelianObat,
  getPembelianObatById,
  createPembelianObat,
  updatePembelianObat,
  deletePembelianObat,
} = require('../controllers/pembelianObatController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllPembelianObat);
router.get('/:id', getPembelianObatById);
router.post('/', createPembelianObat);
router.put('/:id', updatePembelianObat);
router.delete('/:id', deletePembelianObat);

module.exports = router;
