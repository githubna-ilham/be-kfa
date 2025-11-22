const { Obat, KategoriObat, Satuan, GolonganObat, BentukSediaan, Supplier } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all obat with pagination, search, and filters
const getAllObat = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['kodeObat', 'namaObat', 'deskripsi'],
      allowedFilters: [
        'kategoriObatId',
        'satuanId',
        'golonganObatId',
        'bentukSediaanId',
        'supplierId',
        'isActive',
      ],
      defaultSort: 'id',
    });

    const { count, rows } = await Obat.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
      include: [
        {
          model: KategoriObat,
          as: 'kategoriObat',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Satuan,
          as: 'satuan',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: GolonganObat,
          as: 'golonganObat',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: BentukSediaan,
          as: 'bentukSediaan',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'kode', 'nama', 'noTelp', 'email'],
        },
      ],
    });

    res.json(formatPaginatedResponse(rows, count, queryOptions.page, queryOptions.limit));
  } catch (error) {
    console.error('Error getting obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get obat',
      error: error.message,
    });
  }
};

// Get obat by ID
const getObatById = async (req, res) => {
  try {
    const { id } = req.params;
    const obat = await Obat.findByPk(id, {
      include: [
        {
          model: KategoriObat,
          as: 'kategoriObat',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Satuan,
          as: 'satuan',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: GolonganObat,
          as: 'golonganObat',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: BentukSediaan,
          as: 'bentukSediaan',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'kode', 'nama', 'noTelp', 'email'],
        },
      ],
    });

    if (!obat) {
      return res.status(404).json({
        success: false,
        message: 'Obat not found',
      });
    }

    res.json({
      success: true,
      data: obat,
    });
  } catch (error) {
    console.error('Error getting obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get obat',
      error: error.message,
    });
  }
};

// Create obat
const createObat = async (req, res) => {
  try {
    const {
      kodeObat,
      namaObat,
      kategoriObatId,
      satuanId,
      golonganObatId,
      bentukSediaanId,
      supplierId,
      hargaBeli,
      hargaJual,
      stok,
      stokMinimal,
      tanggalKadaluarsa,
      noBatch,
      deskripsi,
      isActive,
    } = req.body;

    if (!kodeObat || !namaObat || !kategoriObatId || !satuanId) {
      return res.status(400).json({
        success: false,
        message: 'kodeObat, namaObat, kategoriObatId, and satuanId are required',
      });
    }

    const obat = await Obat.create({
      kodeObat,
      namaObat,
      kategoriObatId,
      satuanId,
      golonganObatId,
      bentukSediaanId,
      supplierId,
      hargaBeli: hargaBeli || 0,
      hargaJual: hargaJual || 0,
      stok: stok || 0,
      stokMinimal: stokMinimal || 10,
      tanggalKadaluarsa,
      noBatch,
      deskripsi,
      isActive: isActive !== undefined ? isActive : true,
    });

    const obatWithRelations = await Obat.findByPk(obat.id, {
      include: [
        {
          model: KategoriObat,
          as: 'kategoriObat',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Satuan,
          as: 'satuan',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: GolonganObat,
          as: 'golonganObat',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: BentukSediaan,
          as: 'bentukSediaan',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'kode', 'nama', 'noTelp', 'email'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Obat created successfully',
      data: obatWithRelations,
    });
  } catch (error) {
    console.error('Error creating obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create obat',
      error: error.message,
    });
  }
};

// Update obat
const updateObat = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      kodeObat,
      namaObat,
      kategoriObatId,
      satuanId,
      golonganObatId,
      bentukSediaanId,
      supplierId,
      hargaBeli,
      hargaJual,
      stok,
      stokMinimal,
      tanggalKadaluarsa,
      noBatch,
      deskripsi,
      isActive,
    } = req.body;

    const obat = await Obat.findByPk(id);

    if (!obat) {
      return res.status(404).json({
        success: false,
        message: 'Obat not found',
      });
    }

    await obat.update({
      kodeObat: kodeObat || obat.kodeObat,
      namaObat: namaObat || obat.namaObat,
      kategoriObatId: kategoriObatId !== undefined ? kategoriObatId : obat.kategoriObatId,
      satuanId: satuanId !== undefined ? satuanId : obat.satuanId,
      golonganObatId: golonganObatId !== undefined ? golonganObatId : obat.golonganObatId,
      bentukSediaanId: bentukSediaanId !== undefined ? bentukSediaanId : obat.bentukSediaanId,
      supplierId: supplierId !== undefined ? supplierId : obat.supplierId,
      hargaBeli: hargaBeli !== undefined ? hargaBeli : obat.hargaBeli,
      hargaJual: hargaJual !== undefined ? hargaJual : obat.hargaJual,
      stok: stok !== undefined ? stok : obat.stok,
      stokMinimal: stokMinimal !== undefined ? stokMinimal : obat.stokMinimal,
      tanggalKadaluarsa: tanggalKadaluarsa !== undefined ? tanggalKadaluarsa : obat.tanggalKadaluarsa,
      noBatch: noBatch !== undefined ? noBatch : obat.noBatch,
      deskripsi: deskripsi !== undefined ? deskripsi : obat.deskripsi,
      isActive: isActive !== undefined ? isActive : obat.isActive,
    });

    const obatWithRelations = await Obat.findByPk(id, {
      include: [
        {
          model: KategoriObat,
          as: 'kategoriObat',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Satuan,
          as: 'satuan',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: GolonganObat,
          as: 'golonganObat',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: BentukSediaan,
          as: 'bentukSediaan',
          attributes: ['id', 'kode', 'nama'],
        },
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'kode', 'nama', 'noTelp', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Obat updated successfully',
      data: obatWithRelations,
    });
  } catch (error) {
    console.error('Error updating obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update obat',
      error: error.message,
    });
  }
};

// Delete obat
const deleteObat = async (req, res) => {
  try {
    const { id } = req.params;

    const obat = await Obat.findByPk(id);

    if (!obat) {
      return res.status(404).json({
        success: false,
        message: 'Obat not found',
      });
    }

    await obat.destroy();

    res.json({
      success: true,
      message: 'Obat deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete obat',
      error: error.message,
    });
  }
};

module.exports = {
  getAllObat,
  getObatById,
  createObat,
  updateObat,
  deleteObat,
};
