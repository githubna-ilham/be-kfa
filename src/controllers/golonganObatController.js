const { GolonganObat } = require('../models');

// Get all golongan obat
const getAllGolonganObat = async (req, res) => {
  try {
    const golonganObat = await GolonganObat.findAll({
      order: [['id', 'ASC']],
    });
    res.json({
      success: true,
      data: golonganObat,
    });
  } catch (error) {
    console.error('Error getting golongan obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get golongan obat',
      error: error.message,
    });
  }
};

// Get golongan obat by ID
const getGolonganObatById = async (req, res) => {
  try {
    const { id } = req.params;
    const golonganObat = await GolonganObat.findByPk(id);

    if (!golonganObat) {
      return res.status(404).json({
        success: false,
        message: 'Golongan obat not found',
      });
    }

    res.json({
      success: true,
      data: golonganObat,
    });
  } catch (error) {
    console.error('Error getting golongan obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get golongan obat',
      error: error.message,
    });
  }
};

// Create golongan obat
const createGolonganObat = async (req, res) => {
  try {
    const { nama_golongan, keterangan } = req.body;

    if (!nama_golongan) {
      return res.status(400).json({
        success: false,
        message: 'Nama golongan is required',
      });
    }

    const golonganObat = await GolonganObat.create({
      nama_golongan,
      keterangan,
    });

    res.status(201).json({
      success: true,
      message: 'Golongan obat created successfully',
      data: golonganObat,
    });
  } catch (error) {
    console.error('Error creating golongan obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create golongan obat',
      error: error.message,
    });
  }
};

// Update golongan obat
const updateGolonganObat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_golongan, keterangan } = req.body;

    const golonganObat = await GolonganObat.findByPk(id);

    if (!golonganObat) {
      return res.status(404).json({
        success: false,
        message: 'Golongan obat not found',
      });
    }

    await golonganObat.update({
      nama_golongan: nama_golongan || golonganObat.nama_golongan,
      keterangan: keterangan !== undefined ? keterangan : golonganObat.keterangan,
    });

    res.json({
      success: true,
      message: 'Golongan obat updated successfully',
      data: golonganObat,
    });
  } catch (error) {
    console.error('Error updating golongan obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update golongan obat',
      error: error.message,
    });
  }
};

// Delete golongan obat
const deleteGolonganObat = async (req, res) => {
  try {
    const { id } = req.params;

    const golonganObat = await GolonganObat.findByPk(id);

    if (!golonganObat) {
      return res.status(404).json({
        success: false,
        message: 'Golongan obat not found',
      });
    }

    await golonganObat.destroy();

    res.json({
      success: true,
      message: 'Golongan obat deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting golongan obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete golongan obat',
      error: error.message,
    });
  }
};

module.exports = {
  getAllGolonganObat,
  getGolonganObatById,
  createGolonganObat,
  updateGolonganObat,
  deleteGolonganObat,
};
