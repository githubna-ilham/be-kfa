const { Obat, KategoriObat, Satuan, GolonganObat, BentukSediaan } = require('../models');

// Get all obat
const getAllObat = async (req, res) => {
  try {
    const obat = await Obat.findAll({
      include: [
        {
          model: KategoriObat,
          as: 'kategori',
          attributes: ['id', 'nama_kategori'],
        },
        {
          model: Satuan,
          as: 'satuan',
          attributes: ['id', 'nama_satuan'],
        },
        {
          model: GolonganObat,
          as: 'golongan',
          attributes: ['id', 'nama_golongan'],
        },
        {
          model: BentukSediaan,
          as: 'bentukSediaan',
          attributes: ['id', 'nama_bentuk'],
        },
      ],
      order: [['id', 'ASC']],
    });
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

// Get obat by ID
const getObatById = async (req, res) => {
  try {
    const { id } = req.params;
    const obat = await Obat.findByPk(id, {
      include: [
        {
          model: KategoriObat,
          as: 'kategori',
          attributes: ['id', 'nama_kategori'],
        },
        {
          model: Satuan,
          as: 'satuan',
          attributes: ['id', 'nama_satuan'],
        },
        {
          model: GolonganObat,
          as: 'golongan',
          attributes: ['id', 'nama_golongan'],
        },
        {
          model: BentukSediaan,
          as: 'bentukSediaan',
          attributes: ['id', 'nama_bentuk'],
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
      kode_obat,
      nama_obat,
      kategori_id,
      satuan_id,
      golongan_id,
      bentuk_sediaan_id,
      harga_beli,
      harga_jual,
      stok,
      stok_minimum,
      tanggal_kadaluarsa,
      deskripsi,
    } = req.body;

    if (!kode_obat || !nama_obat || !kategori_id || !satuan_id) {
      return res.status(400).json({
        success: false,
        message: 'Kode obat, nama obat, kategori_id, and satuan_id are required',
      });
    }

    const obat = await Obat.create({
      kode_obat,
      nama_obat,
      kategori_id,
      satuan_id,
      golongan_id,
      bentuk_sediaan_id,
      harga_beli: harga_beli || 0,
      harga_jual: harga_jual || 0,
      stok: stok || 0,
      stok_minimum: stok_minimum || 0,
      tanggal_kadaluarsa,
      deskripsi,
    });

    const obatWithRelations = await Obat.findByPk(obat.id, {
      include: [
        {
          model: KategoriObat,
          as: 'kategori',
          attributes: ['id', 'nama_kategori'],
        },
        {
          model: Satuan,
          as: 'satuan',
          attributes: ['id', 'nama_satuan'],
        },
        {
          model: GolonganObat,
          as: 'golongan',
          attributes: ['id', 'nama_golongan'],
        },
        {
          model: BentukSediaan,
          as: 'bentukSediaan',
          attributes: ['id', 'nama_bentuk'],
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
      kode_obat,
      nama_obat,
      kategori_id,
      satuan_id,
      golongan_id,
      bentuk_sediaan_id,
      harga_beli,
      harga_jual,
      stok,
      stok_minimum,
      tanggal_kadaluarsa,
      deskripsi,
    } = req.body;

    const obat = await Obat.findByPk(id);

    if (!obat) {
      return res.status(404).json({
        success: false,
        message: 'Obat not found',
      });
    }

    await obat.update({
      kode_obat: kode_obat || obat.kode_obat,
      nama_obat: nama_obat || obat.nama_obat,
      kategori_id: kategori_id || obat.kategori_id,
      satuan_id: satuan_id || obat.satuan_id,
      golongan_id: golongan_id !== undefined ? golongan_id : obat.golongan_id,
      bentuk_sediaan_id: bentuk_sediaan_id !== undefined ? bentuk_sediaan_id : obat.bentuk_sediaan_id,
      harga_beli: harga_beli !== undefined ? harga_beli : obat.harga_beli,
      harga_jual: harga_jual !== undefined ? harga_jual : obat.harga_jual,
      stok: stok !== undefined ? stok : obat.stok,
      stok_minimum: stok_minimum !== undefined ? stok_minimum : obat.stok_minimum,
      tanggal_kadaluarsa: tanggal_kadaluarsa !== undefined ? tanggal_kadaluarsa : obat.tanggal_kadaluarsa,
      deskripsi: deskripsi !== undefined ? deskripsi : obat.deskripsi,
    });

    const obatWithRelations = await Obat.findByPk(id, {
      include: [
        {
          model: KategoriObat,
          as: 'kategori',
          attributes: ['id', 'nama_kategori'],
        },
        {
          model: Satuan,
          as: 'satuan',
          attributes: ['id', 'nama_satuan'],
        },
        {
          model: GolonganObat,
          as: 'golongan',
          attributes: ['id', 'nama_golongan'],
        },
        {
          model: BentukSediaan,
          as: 'bentukSediaan',
          attributes: ['id', 'nama_bentuk'],
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
