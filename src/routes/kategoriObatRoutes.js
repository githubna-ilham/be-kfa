const express = require('express');
const router = express.Router();
const {
  getAllKategoriObat,
  getKategoriObatById,
  createKategoriObat,
  updateKategoriObat,
  deleteKategoriObat,
} = require('../controllers/kategoriObatController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllKategoriObat);
router.get('/:id', getKategoriObatById);
router.post('/', createKategoriObat);
router.put('/:id', updateKategoriObat);
router.delete('/:id', deleteKategoriObat);

module.exports = router;
