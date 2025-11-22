const { UnitKerja } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all unit kerja with pagination, search, and filters
const getAllUnitKerja = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['kode', 'nama', 'deskripsi'],
      allowedFilters: ['isActive'],
      defaultSort: 'id',
    });

    const { count, rows } = await UnitKerja.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
    });

    res.json(formatPaginatedResponse(rows, count, queryOptions.page, queryOptions.limit));
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
    const { kode, nama, deskripsi, isActive } = req.body;

    if (!kode || !nama) {
      return res.status(400).json({
        success: false,
        message: 'Kode and nama are required',
      });
    }

    const unitKerja = await UnitKerja.create({
      kode,
      nama,
      deskripsi,
      isActive: isActive !== undefined ? isActive : true,
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
    const { kode, nama, deskripsi, isActive } = req.body;

    const unitKerja = await UnitKerja.findByPk(id);

    if (!unitKerja) {
      return res.status(404).json({
        success: false,
        message: 'Unit kerja not found',
      });
    }

    await unitKerja.update({
      kode: kode || unitKerja.kode,
      nama: nama || unitKerja.nama,
      deskripsi: deskripsi !== undefined ? deskripsi : unitKerja.deskripsi,
      isActive: isActive !== undefined ? isActive : unitKerja.isActive,
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
