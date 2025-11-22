const { UnitKerja } = require('../models');

// Get all unit kerja
const getAllUnitKerja = async (req, res) => {
  try {
    const unitKerja = await UnitKerja.findAll({
      order: [['id', 'ASC']],
    });
    res.json({
      success: true,
      data: unitKerja,
    });
  } catch (error) {
    console.error('Error getting unit kerja:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unit kerja',
      error: error.message,
    });
  }
};

// Get unit kerja by ID
const getUnitKerjaById = async (req, res) => {
  try {
    const { id } = req.params;
    const unitKerja = await UnitKerja.findByPk(id);

    if (!unitKerja) {
      return res.status(404).json({
        success: false,
        message: 'Unit kerja not found',
      });
    }

    res.json({
      success: true,
      data: unitKerja,
    });
  } catch (error) {
    console.error('Error getting unit kerja:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unit kerja',
      error: error.message,
    });
  }
};

// Create unit kerja
const createUnitKerja = async (req, res) => {
  try {
    const { nama_unit, keterangan } = req.body;

    if (!nama_unit) {
      return res.status(400).json({
        success: false,
        message: 'Nama unit is required',
      });
    }

    const unitKerja = await UnitKerja.create({
      nama_unit,
      keterangan,
    });

    res.status(201).json({
      success: true,
      message: 'Unit kerja created successfully',
      data: unitKerja,
    });
  } catch (error) {
    console.error('Error creating unit kerja:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create unit kerja',
      error: error.message,
    });
  }
};

// Update unit kerja
const updateUnitKerja = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_unit, keterangan } = req.body;

    const unitKerja = await UnitKerja.findByPk(id);

    if (!unitKerja) {
      return res.status(404).json({
        success: false,
        message: 'Unit kerja not found',
      });
    }

    await unitKerja.update({
      nama_unit: nama_unit || unitKerja.nama_unit,
      keterangan: keterangan !== undefined ? keterangan : unitKerja.keterangan,
    });

    res.json({
      success: true,
      message: 'Unit kerja updated successfully',
      data: unitKerja,
    });
  } catch (error) {
    console.error('Error updating unit kerja:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update unit kerja',
      error: error.message,
    });
  }
};

// Delete unit kerja
const deleteUnitKerja = async (req, res) => {
  try {
    const { id } = req.params;

    const unitKerja = await UnitKerja.findByPk(id);

    if (!unitKerja) {
      return res.status(404).json({
        success: false,
        message: 'Unit kerja not found',
      });
    }

    await unitKerja.destroy();

    res.json({
      success: true,
      message: 'Unit kerja deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting unit kerja:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete unit kerja',
      error: error.message,
    });
  }
};

module.exports = {
  getAllUnitKerja,
  getUnitKerjaById,
  createUnitKerja,
  updateUnitKerja,
  deleteUnitKerja,
};
