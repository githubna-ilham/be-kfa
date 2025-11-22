const express = require('express');
const router = express.Router();
const {
  getAllPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai,
} = require('../controllers/pegawaiController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllPegawai);
router.get('/:id', getPegawaiById);
router.post('/', createPegawai);
router.put('/:id', updatePegawai);
router.delete('/:id', deletePegawai);

module.exports = router;
