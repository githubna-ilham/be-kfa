const express = require('express');
const router = express.Router();
const {
  getAllBentukSediaan,
  getBentukSediaanById,
  createBentukSediaan,
  updateBentukSediaan,
  deleteBentukSediaan,
} = require('../controllers/bentukSediaanController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllBentukSediaan);
router.get('/:id', getBentukSediaanById);
router.post('/', createBentukSediaan);
router.put('/:id', updateBentukSediaan);
router.delete('/:id', deleteBentukSediaan);

module.exports = router;
