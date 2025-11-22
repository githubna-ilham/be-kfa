const express = require('express');
const router = express.Router();
const {
  getAllGolonganObat,
  getGolonganObatById,
  createGolonganObat,
  updateGolonganObat,
  deleteGolonganObat,
} = require('../controllers/golonganObatController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllGolonganObat);
router.get('/:id', getGolonganObatById);
router.post('/', createGolonganObat);
router.put('/:id', updateGolonganObat);
router.delete('/:id', deleteGolonganObat);

module.exports = router;
