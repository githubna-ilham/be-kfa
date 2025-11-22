const express = require('express');
const router = express.Router();
const {
  getAllObat,
  getObatById,
  createObat,
  updateObat,
  deleteObat,
} = require('../controllers/obatController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllObat);
router.get('/:id', getObatById);
router.post('/', createObat);
router.put('/:id', updateObat);
router.delete('/:id', deleteObat);

module.exports = router;
