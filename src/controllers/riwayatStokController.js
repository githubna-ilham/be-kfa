const { RiwayatStok, Obat, User } = require('../models');

// Get all riwayat stok
const getAllRiwayatStok = async (req, res) => {
  try {
    const { obat_id } = req.query;
    const where = {};

    if (obat_id) {
      where.obat_id = obat_id;
    }

    const riwayatStok = await RiwayatStok.findAll({
      where,
      include: [
        {
          model: Obat,
          as: 'obat',
          attributes: ['id', 'kode_obat', 'nama_obat'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['tanggal', 'DESC']],
    });
    res.json({
      success: true,
      data: riwayatStok,
    });
  } catch (error) {
    console.error('Error getting riwayat stok:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get riwayat stok',
      error: error.message,
    });
  }
};

// Get riwayat stok by ID
const getRiwayatStokById = async (req, res) => {
  try {
    const { id } = req.params;
    const riwayatStok = await RiwayatStok.findByPk(id, {
      include: [
        {
          model: Obat,
          as: 'obat',
          attributes: ['id', 'kode_obat', 'nama_obat'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    if (!riwayatStok) {
      return res.status(404).json({
        success: false,
        message: 'Riwayat stok not found',
      });
    }

    res.json({
      success: true,
      data: riwayatStok,
    });
  } catch (error) {
    console.error('Error getting riwayat stok:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get riwayat stok',
      error: error.message,
    });
  }
};

// Create riwayat stok
const createRiwayatStok = async (req, res) => {
  try {
    const {
      obat_id,
      jenis_transaksi,
      jumlah,
      stok_sebelum,
      stok_sesudah,
      referensi_id,
      user_id,
      tanggal,
      keterangan,
    } = req.body;

    if (!obat_id || !jenis_transaksi || !jumlah) {
      return res.status(400).json({
        success: false,
        message: 'Obat ID, jenis transaksi, and jumlah are required',
      });
    }

    const riwayatStok = await RiwayatStok.create({
      obat_id,
      jenis_transaksi,
      jumlah,
      stok_sebelum: stok_sebelum || 0,
      stok_sesudah: stok_sesudah || 0,
      referensi_id,
      user_id,
      tanggal: tanggal || new Date(),
      keterangan,
    });

    const riwayatStokWithRelations = await RiwayatStok.findByPk(riwayatStok.id, {
      include: [
        {
          model: Obat,
          as: 'obat',
          attributes: ['id', 'kode_obat', 'nama_obat'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Riwayat stok created successfully',
      data: riwayatStokWithRelations,
    });
  } catch (error) {
    console.error('Error creating riwayat stok:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create riwayat stok',
      error: error.message,
    });
  }
};

// Delete riwayat stok
const deleteRiwayatStok = async (req, res) => {
  try {
    const { id } = req.params;

    const riwayatStok = await RiwayatStok.findByPk(id);

    if (!riwayatStok) {
      return res.status(404).json({
        success: false,
        message: 'Riwayat stok not found',
      });
    }

    await riwayatStok.destroy();

    res.json({
      success: true,
      message: 'Riwayat stok deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting riwayat stok:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete riwayat stok',
      error: error.message,
    });
  }
};

module.exports = {
  getAllRiwayatStok,
  getRiwayatStokById,
  createRiwayatStok,
  deleteRiwayatStok,
};
