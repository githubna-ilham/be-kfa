const { Transaksi, DetailTransaksi, Customer, Obat, User } = require('../models');
const { sequelize } = require('../models');

// Get all transaksi
const getAllTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'kode', 'nama', 'noTelp'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: DetailTransaksi,
          as: 'detailTransaksi',
          include: [
            {
              model: Obat,
              as: 'obat',
              attributes: ['id', 'kodeObat', 'namaObat'],
            },
          ],
        },
      ],
      order: [['tanggal_transaksi', 'DESC']],
    });
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
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: DetailTransaksi,
          as: 'detailTransaksi',
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
      customer_id,
      user_id,
      tanggal_transaksi,
      total_harga,
      diskon,
      pajak,
      total_bayar,
      uang_bayar,
      uang_kembali,
      status_pembayaran,
      metode_pembayaran,
      catatan,
      detail_transaksi,
    } = req.body;

    if (!user_id || !detail_transaksi || detail_transaksi.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User ID and detail transaksi are required',
      });
    }

    // Create transaksi
    const transaksi = await Transaksi.create(
      {
        customer_id,
        user_id,
        tanggal_transaksi: tanggal_transaksi || new Date(),
        total_harga: total_harga || 0,
        diskon: diskon || 0,
        pajak: pajak || 0,
        total_bayar: total_bayar || 0,
        uang_bayar: uang_bayar || 0,
        uang_kembali: uang_kembali || 0,
        status_pembayaran: status_pembayaran || 'lunas',
        metode_pembayaran,
        catatan,
      },
      { transaction: t }
    );

    // Create detail transaksi
    const detailPromises = detail_transaksi.map(async (detail) => {
      // Update stok obat
      const obat = await Obat.findByPk(detail.obat_id, { transaction: t });
      if (!obat) {
        throw new Error(`Obat with ID ${detail.obat_id} not found`);
      }

      if (obat.stok < detail.jumlah) {
        throw new Error(`Stok ${obat.nama_obat} tidak mencukupi`);
      }

      await obat.update(
        { stok: obat.stok - detail.jumlah },
        { transaction: t }
      );

      return DetailTransaksi.create(
        {
          transaksi_id: transaksi.id,
          obat_id: detail.obat_id,
          jumlah: detail.jumlah,
          harga_satuan: detail.harga_satuan,
          subtotal: detail.subtotal,
          diskon_item: detail.diskon_item || 0,
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
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: DetailTransaksi,
          as: 'detailTransaksi',
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
      customer_id,
      status_pembayaran,
      metode_pembayaran,
      catatan,
    } = req.body;

    const transaksi = await Transaksi.findByPk(id);

    if (!transaksi) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi not found',
      });
    }

    await transaksi.update({
      customer_id: customer_id !== undefined ? customer_id : transaksi.customer_id,
      status_pembayaran: status_pembayaran || transaksi.status_pembayaran,
      metode_pembayaran: metode_pembayaran !== undefined ? metode_pembayaran : transaksi.metode_pembayaran,
      catatan: catatan !== undefined ? catatan : transaksi.catatan,
    });

    const transaksiWithRelations = await Transaksi.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'kode', 'nama', 'noTelp'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: DetailTransaksi,
          as: 'detailTransaksi',
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
          as: 'detailTransaksi',
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
    for (const detail of transaksi.detailTransaksi) {
      const obat = await Obat.findByPk(detail.obat_id, { transaction: t });
      if (obat) {
        await obat.update(
          { stok: obat.stok + detail.jumlah },
          { transaction: t }
        );
      }
    }

    // Delete detail first
    await DetailTransaksi.destroy({
      where: { transaksi_id: id },
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
