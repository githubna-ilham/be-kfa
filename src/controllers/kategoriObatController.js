const { KategoriObat } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all kategori obat with pagination, search, and filters
const getAllKategoriObat = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['kode', 'nama', 'deskripsi'],
      allowedFilters: ['isActive'],
      defaultSort: 'id',
    });

    const { count, rows } = await KategoriObat.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
    });

    res.json(formatPaginatedResponse(rows, count, queryOptions.page, queryOptions.limit));
  } catch (error) {
    console.error('Error getting kategori obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get kategori obat',
      error: error.message,
    });
  }
};

// Get kategori obat by ID
const getKategoriObatById = async (req, res) => {
  try {
    const { id } = req.params;
    const kategoriObat = await KategoriObat.findByPk(id);

    if (!kategoriObat) {
      return res.status(404).json({
        success: false,
        message: 'Kategori obat not found',
      });
    }

    res.json({
      success: true,
      data: kategoriObat,
    });
  } catch (error) {
    console.error('Error getting kategori obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get kategori obat',
      error: error.message,
    });
  }
};

// Create kategori obat
const createKategoriObat = async (req, res) => {
  try {
    const { nama_kategori, keterangan } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({
        success: false,
        message: 'Nama kategori is required',
      });
    }

    const kategoriObat = await KategoriObat.create({
      nama_kategori,
      keterangan,
    });

    res.status(201).json({
      success: true,
      message: 'Kategori obat created successfully',
      data: kategoriObat,
    });
  } catch (error) {
    console.error('Error creating kategori obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create kategori obat',
      error: error.message,
    });
  }
};

// Update kategori obat
const updateKategoriObat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori, keterangan } = req.body;

    const kategoriObat = await KategoriObat.findByPk(id);

    if (!kategoriObat) {
      return res.status(404).json({
        success: false,
        message: 'Kategori obat not found',
      });
    }

    await kategoriObat.update({
      nama_kategori: nama_kategori || kategoriObat.nama_kategori,
      keterangan: keterangan !== undefined ? keterangan : kategoriObat.keterangan,
    });

    res.json({
      success: true,
      message: 'Kategori obat updated successfully',
      data: kategoriObat,
    });
  } catch (error) {
    console.error('Error updating kategori obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update kategori obat',
      error: error.message,
    });
  }
};

// Delete kategori obat
const deleteKategoriObat = async (req, res) => {
  try {
    const { id } = req.params;

    const kategoriObat = await KategoriObat.findByPk(id);

    if (!kategoriObat) {
      return res.status(404).json({
        success: false,
        message: 'Kategori obat not found',
      });
    }

    await kategoriObat.destroy();

    res.json({
      success: true,
      message: 'Kategori obat deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting kategori obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete kategori obat',
      error: error.message,
    });
  }
};

module.exports = {
  getAllKategoriObat,
  getKategoriObatById,
  createKategoriObat,
  updateKategoriObat,
  deleteKategoriObat,
};
