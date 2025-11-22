const express = require('express');
const router = express.Router();
const {
  getAllRiwayatStok,
  getRiwayatStokById,
  createRiwayatStok,
  deleteRiwayatStok,
} = require('../controllers/riwayatStokController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllRiwayatStok);
router.get('/:id', getRiwayatStokById);
router.post('/', createRiwayatStok);
router.delete('/:id', deleteRiwayatStok);

module.exports = router;
