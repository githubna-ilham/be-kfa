const { BentukSediaan } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all bentuk sediaan with pagination, search, and filters
const getAllBentukSediaan = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['kode', 'nama', 'deskripsi'],
      allowedFilters: ['isActive'],
      defaultSort: 'id',
    });

    const { count, rows } = await BentukSediaan.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
    });

    res.json(formatPaginatedResponse(rows, count, queryOptions.page, queryOptions.limit));
  } catch (error) {
    console.error('Error getting bentuk sediaan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bentuk sediaan',
      error: error.message,
    });
  }
};

// Get bentuk sediaan by ID
const getBentukSediaanById = async (req, res) => {
  try {
    const { id } = req.params;
    const bentukSediaan = await BentukSediaan.findByPk(id);

    if (!bentukSediaan) {
      return res.status(404).json({
        success: false,
        message: 'Bentuk sediaan not found',
      });
    }

    res.json({
      success: true,
      data: bentukSediaan,
    });
  } catch (error) {
    console.error('Error getting bentuk sediaan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bentuk sediaan',
      error: error.message,
    });
  }
};

// Create bentuk sediaan
const createBentukSediaan = async (req, res) => {
  try {
    const { nama_bentuk, keterangan } = req.body;

    if (!nama_bentuk) {
      return res.status(400).json({
        success: false,
        message: 'Nama bentuk is required',
      });
    }

    const bentukSediaan = await BentukSediaan.create({
      nama_bentuk,
      keterangan,
    });

    res.status(201).json({
      success: true,
      message: 'Bentuk sediaan created successfully',
      data: bentukSediaan,
    });
  } catch (error) {
    console.error('Error creating bentuk sediaan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bentuk sediaan',
      error: error.message,
    });
  }
};

// Update bentuk sediaan
const updateBentukSediaan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_bentuk, keterangan } = req.body;

    const bentukSediaan = await BentukSediaan.findByPk(id);

    if (!bentukSediaan) {
      return res.status(404).json({
        success: false,
        message: 'Bentuk sediaan not found',
      });
    }

    await bentukSediaan.update({
      nama_bentuk: nama_bentuk || bentukSediaan.nama_bentuk,
      keterangan: keterangan !== undefined ? keterangan : bentukSediaan.keterangan,
    });

    res.json({
      success: true,
      message: 'Bentuk sediaan updated successfully',
      data: bentukSediaan,
    });
  } catch (error) {
    console.error('Error updating bentuk sediaan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bentuk sediaan',
      error: error.message,
    });
  }
};

// Delete bentuk sediaan
const deleteBentukSediaan = async (req, res) => {
  try {
    const { id } = req.params;

    const bentukSediaan = await BentukSediaan.findByPk(id);

    if (!bentukSediaan) {
      return res.status(404).json({
        success: false,
        message: 'Bentuk sediaan not found',
      });
    }

    await bentukSediaan.destroy();

    res.json({
      success: true,
      message: 'Bentuk sediaan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting bentuk sediaan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bentuk sediaan',
      error: error.message,
    });
  }
};

module.exports = {
  getAllBentukSediaan,
  getBentukSediaanById,
  createBentukSediaan,
  updateBentukSediaan,
  deleteBentukSediaan,
};
