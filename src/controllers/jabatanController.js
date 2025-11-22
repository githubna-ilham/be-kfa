const { Jabatan } = require('../models');

// Get all jabatan
const getAllJabatan = async (req, res) => {
  try {
    const jabatan = await Jabatan.findAll({
      order: [['id', 'ASC']],
    });
    res.json({
      success: true,
      data: jabatan,
    });
  } catch (error) {
    console.error('Error getting jabatan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jabatan',
      error: error.message,
    });
  }
};

// Get jabatan by ID
const getJabatanById = async (req, res) => {
  try {
    const { id } = req.params;
    const jabatan = await Jabatan.findByPk(id);

    if (!jabatan) {
      return res.status(404).json({
        success: false,
        message: 'Jabatan not found',
      });
    }

    res.json({
      success: true,
      data: jabatan,
    });
  } catch (error) {
    console.error('Error getting jabatan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get jabatan',
      error: error.message,
    });
  }
};

// Create jabatan
const createJabatan = async (req, res) => {
  try {
    const { nama_jabatan, keterangan } = req.body;

    if (!nama_jabatan) {
      return res.status(400).json({
        success: false,
        message: 'Nama jabatan is required',
      });
    }

    const jabatan = await Jabatan.create({
      nama_jabatan,
      keterangan,
    });

    res.status(201).json({
      success: true,
      message: 'Jabatan created successfully',
      data: jabatan,
    });
  } catch (error) {
    console.error('Error creating jabatan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create jabatan',
      error: error.message,
    });
  }
};

// Update jabatan
const updateJabatan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_jabatan, keterangan } = req.body;

    const jabatan = await Jabatan.findByPk(id);

    if (!jabatan) {
      return res.status(404).json({
        success: false,
        message: 'Jabatan not found',
      });
    }

    await jabatan.update({
      nama_jabatan: nama_jabatan || jabatan.nama_jabatan,
      keterangan: keterangan !== undefined ? keterangan : jabatan.keterangan,
    });

    res.json({
      success: true,
      message: 'Jabatan updated successfully',
      data: jabatan,
    });
  } catch (error) {
    console.error('Error updating jabatan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update jabatan',
      error: error.message,
    });
  }
};

// Delete jabatan
const deleteJabatan = async (req, res) => {
  try {
    const { id } = req.params;

    const jabatan = await Jabatan.findByPk(id);

    if (!jabatan) {
      return res.status(404).json({
        success: false,
        message: 'Jabatan not found',
      });
    }

    await jabatan.destroy();

    res.json({
      success: true,
      message: 'Jabatan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting jabatan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete jabatan',
      error: error.message,
    });
  }
};

module.exports = {
  getAllJabatan,
  getJabatanById,
  createJabatan,
  updateJabatan,
  deleteJabatan,
};
