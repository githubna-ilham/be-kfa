const { RiwayatStok, Obat, Pegawai, User, Satuan } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all riwayat stok with pagination, search, and filters
const getAllRiwayatStok = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['keterangan'],
      allowedFilters: ['obatId', 'jenisMutasi', 'referensiTipe', 'createdBy'],
      defaultSort: 'tanggalMutasi',
      dateFields: ['tanggalMutasi'],
    });

    // Override default sort to DESC for riwayat stok
    if (!req.query.sortOrder) {
      queryOptions.order = [['tanggalMutasi', 'DESC']];
    }

    const { count, rows } = await RiwayatStok.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
      include: [
        {
          model: Obat,
          as: 'obat',
          attributes: ['id', 'kodeObat', 'namaObat'],
          include: [
            {
              model: Satuan,
              as: 'satuan',
              attributes: ['id', 'nama', 'simbol'],
            },
          ],
        },
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email'],
          required: false, // LEFT JOIN - riwayat tanpa pegawai juga ditampilkan
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'role'],
            },
          ],
        },
      ],
    });

    res.json(formatPaginatedResponse(rows, count, queryOptions.page, queryOptions.limit));
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
          attributes: ['id', 'kodeObat', 'namaObat'],
          include: [
            {
              model: Satuan,
              as: 'satuan',
              attributes: ['id', 'nama', 'simbol'],
            },
          ],
        },
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email'],
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'role'],
            },
          ],
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
      obatId,
      jenisMutasi,
      qtyMasuk,
      qtyKeluar,
      stokSebelum,
      stokSesudah,
      referensiTipe,
      referensiId,
      tanggalMutasi,
      keterangan,
    } = req.body;

    if (!obatId || !jenisMutasi) {
      return res.status(400).json({
        success: false,
        message: 'Obat ID and jenis mutasi are required',
      });
    }

    // Get createdBy from logged-in user's pegawai data
    let createdBy = null;
    if (req.user) {
      const pegawai = await Pegawai.findOne({
        where: { userId: req.user.id },
      });
      if (pegawai) {
        createdBy = pegawai.id;
      }
    }

    const riwayatStok = await RiwayatStok.create({
      obatId,
      jenisMutasi,
      qtyMasuk: qtyMasuk || 0,
      qtyKeluar: qtyKeluar || 0,
      stokSebelum: stokSebelum || 0,
      stokSesudah: stokSesudah || 0,
      referensiTipe,
      referensiId,
      tanggalMutasi: tanggalMutasi || new Date(),
      keterangan,
      createdBy,
    });

    const riwayatStokWithRelations = await RiwayatStok.findByPk(riwayatStok.id, {
      include: [
        {
          model: Obat,
          as: 'obat',
          attributes: ['id', 'kodeObat', 'namaObat'],
          include: [
            {
              model: Satuan,
              as: 'satuan',
              attributes: ['id', 'nama', 'simbol'],
            },
          ],
        },
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email'],
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'role'],
            },
          ],
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
