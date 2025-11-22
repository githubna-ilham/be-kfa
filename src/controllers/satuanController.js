const { Satuan } = require('../models');

// Get all satuan
const getAllSatuan = async (req, res) => {
  try {
    const satuan = await Satuan.findAll({
      order: [['id', 'ASC']],
    });
    res.json({
      success: true,
      data: satuan,
    });
  } catch (error) {
    console.error('Error getting satuan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get satuan',
      error: error.message,
    });
  }
};

// Get satuan by ID
const getSatuanById = async (req, res) => {
  try {
    const { id } = req.params;
    const satuan = await Satuan.findByPk(id);

    if (!satuan) {
      return res.status(404).json({
        success: false,
        message: 'Satuan not found',
      });
    }

    res.json({
      success: true,
      data: satuan,
    });
  } catch (error) {
    console.error('Error getting satuan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get satuan',
      error: error.message,
    });
  }
};

// Create satuan
const createSatuan = async (req, res) => {
  try {
    const { nama_satuan, keterangan } = req.body;

    if (!nama_satuan) {
      return res.status(400).json({
        success: false,
        message: 'Nama satuan is required',
      });
    }

    const satuan = await Satuan.create({
      nama_satuan,
      keterangan,
    });

    res.status(201).json({
      success: true,
      message: 'Satuan created successfully',
      data: satuan,
    });
  } catch (error) {
    console.error('Error creating satuan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create satuan',
      error: error.message,
    });
  }
};

// Update satuan
const updateSatuan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_satuan, keterangan } = req.body;

    const satuan = await Satuan.findByPk(id);

    if (!satuan) {
      return res.status(404).json({
        success: false,
        message: 'Satuan not found',
      });
    }

    await satuan.update({
      nama_satuan: nama_satuan || satuan.nama_satuan,
      keterangan: keterangan !== undefined ? keterangan : satuan.keterangan,
    });

    res.json({
      success: true,
      message: 'Satuan updated successfully',
      data: satuan,
    });
  } catch (error) {
    console.error('Error updating satuan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update satuan',
      error: error.message,
    });
  }
};

// Delete satuan
const deleteSatuan = async (req, res) => {
  try {
    const { id } = req.params;

    const satuan = await Satuan.findByPk(id);

    if (!satuan) {
      return res.status(404).json({
        success: false,
        message: 'Satuan not found',
      });
    }

    await satuan.destroy();

    res.json({
      success: true,
      message: 'Satuan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting satuan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete satuan',
      error: error.message,
    });
  }
};

module.exports = {
  getAllSatuan,
  getSatuanById,
  createSatuan,
  updateSatuan,
  deleteSatuan,
};
