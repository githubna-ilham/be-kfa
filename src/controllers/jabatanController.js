const { Jabatan } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all jabatan with pagination, search, and filters
const getAllJabatan = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['kode', 'nama', 'deskripsi'],
      allowedFilters: ['isActive'],
      defaultSort: 'id',
    });

    const { count, rows } = await Jabatan.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
    });

    res.json(formatPaginatedResponse(rows, count, queryOptions.page, queryOptions.limit));
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
    const { kode, nama, deskripsi, isActive } = req.body;

    if (!kode || !nama) {
      return res.status(400).json({
        success: false,
        message: 'Kode and nama are required',
      });
    }

    const jabatan = await Jabatan.create({
      kode,
      nama,
      deskripsi,
      isActive: isActive !== undefined ? isActive : true,
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
    const { kode, nama, deskripsi, isActive } = req.body;

    const jabatan = await Jabatan.findByPk(id);

    if (!jabatan) {
      return res.status(404).json({
        success: false,
        message: 'Jabatan not found',
      });
    }

    await jabatan.update({
      kode: kode || jabatan.kode,
      nama: nama || jabatan.nama,
      deskripsi: deskripsi !== undefined ? deskripsi : jabatan.deskripsi,
      isActive: isActive !== undefined ? isActive : jabatan.isActive,
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
