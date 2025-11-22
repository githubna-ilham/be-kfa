const { Transaksi, DetailTransaksi, Customer, Obat, Pegawai, User } = require('../models');
const { sequelize } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all transaksi with pagination, search, and filters
const getAllTransaksi = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['noFaktur', 'keterangan'],
      allowedFilters: ['customerId', 'pegawaiId', 'status', 'metodePembayaran'],
      defaultSort: 'tanggalTransaksi',
      dateFields: ['tanggalTransaksi'],
    });

    // Override default sort to DESC for transaksi
    if (!req.query.sortOrder) {
      queryOptions.order = [['tanggalTransaksi', 'DESC']];
    }

    const { count, rows } = await Transaksi.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'kode', 'nama', 'noTelp'],
        },
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'role'],
            },
          ],
        },
        {
          model: DetailTransaksi,
          as: 'details',
          include: [
            {
              model: Obat,
              as: 'obat',
              attributes: ['id', 'kodeObat', 'namaObat'],
            },
          ],
        },
      ],
    });

    res.json(formatPaginatedResponse(rows, count, queryOptions.page, queryOptions.limit));
  } catch (error) {
    console.error('Error getting transaksi:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaksi',
      error: error.message,
    });
  }
};

// Get transaksi by ID
const getTransaksiById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaksi = await Transaksi.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'kode', 'nama', 'noTelp', 'alamat'],
        },
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email', 'noTelp'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'role'],
            },
          ],
        },
        {
          model: DetailTransaksi,
          as: 'details',
          include: [
            {
              model: Obat,
              as: 'obat',
              attributes: ['id', 'kodeObat', 'namaObat', 'hargaJual'],
            },
          ],
        },
      ],
    });

    if (!transaksi) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi not found',
      });
    }

    res.json({
      success: true,
      data: transaksi,
    });
  } catch (error) {
    console.error('Error getting transaksi:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaksi',
      error: error.message,
    });
  }
};

// Create transaksi with detail
const createTransaksi = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      noFaktur,
      customerId,
      pegawaiId,
      tanggalTransaksi,
      totalHarga,
      diskon,
      grandTotal,
      metodePembayaran,
      status,
      keterangan,
      details,
    } = req.body;

    if (!pegawaiId || !details || details.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Pegawai ID and detail transaksi are required',
      });
    }

    // Generate noFaktur if not provided
    const generatedNoFaktur = noFaktur || `TRX-${Date.now()}`;

    // Create transaksi
    const transaksi = await Transaksi.create(
      {
        noFaktur: generatedNoFaktur,
        customerId,
        pegawaiId,
        tanggalTransaksi: tanggalTransaksi || new Date(),
        totalHarga: totalHarga || 0,
        diskon: diskon || 0,
        grandTotal: grandTotal || 0,
        metodePembayaran: metodePembayaran || 'Cash',
        status: status || 'pending',
        keterangan,
      },
      { transaction: t }
    );

    // Create detail transaksi
    const detailPromises = details.map(async (detail) => {
      // Update stok obat
      const obat = await Obat.findByPk(detail.obatId, { transaction: t });
      if (!obat) {
        throw new Error(`Obat with ID ${detail.obatId} not found`);
      }

      if (obat.stok < detail.jumlah) {
        throw new Error(`Stok ${obat.namaObat} tidak mencukupi`);
      }

      await obat.update(
        { stok: obat.stok - detail.jumlah },
        { transaction: t }
      );

      return DetailTransaksi.create(
        {
          transaksiId: transaksi.id,
          obatId: detail.obatId,
          jumlah: detail.jumlah,
          hargaSatuan: detail.hargaSatuan,
          subtotal: detail.subtotal,
        },
        { transaction: t }
      );
    });

    await Promise.all(detailPromises);

    await t.commit();

    // Fetch transaksi with relations
    const transaksiWithRelations = await Transaksi.findByPk(transaksi.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'kode', 'nama', 'noTelp'],
        },
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'role'],
            },
          ],
        },
        {
          model: DetailTransaksi,
          as: 'details',
          include: [
            {
              model: Obat,
              as: 'obat',
              attributes: ['id', 'kodeObat', 'namaObat'],
            },
          ],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Transaksi created successfully',
      data: transaksiWithRelations,
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating transaksi:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaksi',
      error: error.message,
    });
  }
};

// Update transaksi
const updateTransaksi = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerId,
      status,
      metodePembayaran,
      keterangan,
    } = req.body;

    const transaksi = await Transaksi.findByPk(id);

    if (!transaksi) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi not found',
      });
    }

    await transaksi.update({
      customerId: customerId !== undefined ? customerId : transaksi.customerId,
      status: status || transaksi.status,
      metodePembayaran: metodePembayaran !== undefined ? metodePembayaran : transaksi.metodePembayaran,
      keterangan: keterangan !== undefined ? keterangan : transaksi.keterangan,
    });

    const transaksiWithRelations = await Transaksi.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'kode', 'nama', 'noTelp'],
        },
        {
          model: Pegawai,
          as: 'pegawai',
          attributes: ['id', 'nip', 'nama', 'email'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'email', 'role'],
            },
          ],
        },
        {
          model: DetailTransaksi,
          as: 'details',
          include: [
            {
              model: Obat,
              as: 'obat',
              attributes: ['id', 'kodeObat', 'namaObat'],
            },
          ],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Transaksi updated successfully',
      data: transaksiWithRelations,
    });
  } catch (error) {
    console.error('Error updating transaksi:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaksi',
      error: error.message,
    });
  }
};

// Delete transaksi
const deleteTransaksi = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const transaksi = await Transaksi.findByPk(id, {
      include: [
        {
          model: DetailTransaksi,
          as: 'details',
        },
      ],
      transaction: t,
    });

    if (!transaksi) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Transaksi not found',
      });
    }

    // Restore stok
    for (const detail of transaksi.details) {
      const obat = await Obat.findByPk(detail.obatId, { transaction: t });
      if (obat) {
        await obat.update(
          { stok: obat.stok + detail.jumlah },
          { transaction: t }
        );
      }
    }

    // Delete detail first
    await DetailTransaksi.destroy({
      where: { transaksiId: id },
      transaction: t,
    });

    // Delete transaksi
    await transaksi.destroy({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: 'Transaksi deleted successfully',
    });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting transaksi:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaksi',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTransaksi,
  getTransaksiById,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
};
