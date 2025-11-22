const { PembelianObat, DetailPembelianObat, Supplier, Obat, User } = require('../models');
const { sequelize } = require('../models');

// Get all pembelian obat
const getAllPembelianObat = async (req, res) => {
  try {
    const pembelianObat = await PembelianObat.findAll({
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'kode', 'nama', 'noTelp'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: DetailPembelianObat,
          as: 'detailPembelian',
          include: [
            {
              model: Obat,
              as: 'obat',
              attributes: ['id', 'kodeObat', 'namaObat'],
            },
          ],
        },
      ],
      order: [['tanggal_pembelian', 'DESC']],
    });
    res.json({
      success: true,
      data: pembelianObat,
    });
  } catch (error) {
    console.error('Error getting pembelian obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pembelian obat',
      error: error.message,
    });
  }
};

// Get pembelian obat by ID
const getPembelianObatById = async (req, res) => {
  try {
    const { id } = req.params;
    const pembelianObat = await PembelianObat.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'kode', 'nama', 'noTelp', 'alamat'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: DetailPembelianObat,
          as: 'detailPembelian',
          include: [
            {
              model: Obat,
              as: 'obat',
              attributes: ['id', 'kodeObat', 'namaObat', 'hargaBeli'],
            },
          ],
        },
      ],
    });

    if (!pembelianObat) {
      return res.status(404).json({
        success: false,
        message: 'Pembelian obat not found',
      });
    }

    res.json({
      success: true,
      data: pembelianObat,
    });
  } catch (error) {
    console.error('Error getting pembelian obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pembelian obat',
      error: error.message,
    });
  }
};

// Create pembelian obat with detail
const createPembelianObat = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      supplier_id,
      user_id,
      tanggal_pembelian,
      nomor_faktur,
      total_harga,
      diskon,
      pajak,
      total_bayar,
      status_pembayaran,
      jatuh_tempo,
      catatan,
      detail_pembelian,
    } = req.body;

    if (!supplier_id || !user_id || !detail_pembelian || detail_pembelian.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Supplier ID, User ID, and detail pembelian are required',
      });
    }

    // Create pembelian obat
    const pembelianObat = await PembelianObat.create(
      {
        supplier_id,
        user_id,
        tanggal_pembelian: tanggal_pembelian || new Date(),
        nomor_faktur,
        total_harga: total_harga || 0,
        diskon: diskon || 0,
        pajak: pajak || 0,
        total_bayar: total_bayar || 0,
        status_pembayaran: status_pembayaran || 'belum_lunas',
        jatuh_tempo,
        catatan,
      },
      { transaction: t }
    );

    // Create detail pembelian and update stok
    const detailPromises = detail_pembelian.map(async (detail) => {
      // Update stok obat
      const obat = await Obat.findByPk(detail.obat_id, { transaction: t });
      if (!obat) {
        throw new Error(`Obat with ID ${detail.obat_id} not found`);
      }

      await obat.update(
        {
          stok: obat.stok + detail.jumlah,
          hargaBeli: detail.harga_satuan, // Update harga beli terakhir
        },
        { transaction: t }
      );

      return DetailPembelianObat.create(
        {
          pembelian_id: pembelianObat.id,
          obat_id: detail.obat_id,
          jumlah: detail.jumlah,
          harga_satuan: detail.harga_satuan,
          subtotal: detail.subtotal,
          tanggal_kadaluarsa: detail.tanggal_kadaluarsa,
          batch_number: detail.batch_number,
        },
        { transaction: t }
      );
    });

    await Promise.all(detailPromises);

    await t.commit();

    // Fetch pembelian with relations
    const pembelianWithRelations = await PembelianObat.findByPk(pembelianObat.id, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'kode', 'nama', 'noTelp'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: DetailPembelianObat,
          as: 'detailPembelian',
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
      message: 'Pembelian obat created successfully',
      data: pembelianWithRelations,
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating pembelian obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pembelian obat',
      error: error.message,
    });
  }
};

// Update pembelian obat
const updatePembelianObat = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      supplier_id,
      status_pembayaran,
      jatuh_tempo,
      catatan,
    } = req.body;

    const pembelianObat = await PembelianObat.findByPk(id);

    if (!pembelianObat) {
      return res.status(404).json({
        success: false,
        message: 'Pembelian obat not found',
      });
    }

    await pembelianObat.update({
      supplier_id: supplier_id || pembelianObat.supplier_id,
      status_pembayaran: status_pembayaran || pembelianObat.status_pembayaran,
      jatuh_tempo: jatuh_tempo !== undefined ? jatuh_tempo : pembelianObat.jatuh_tempo,
      catatan: catatan !== undefined ? catatan : pembelianObat.catatan,
    });

    const pembelianWithRelations = await PembelianObat.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'kode', 'nama', 'noTelp'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
        {
          model: DetailPembelianObat,
          as: 'detailPembelian',
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
      message: 'Pembelian obat updated successfully',
      data: pembelianWithRelations,
    });
  } catch (error) {
    console.error('Error updating pembelian obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pembelian obat',
      error: error.message,
    });
  }
};

// Delete pembelian obat
const deletePembelianObat = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const pembelianObat = await PembelianObat.findByPk(id, {
      include: [
        {
          model: DetailPembelianObat,
          as: 'detailPembelian',
        },
      ],
      transaction: t,
    });

    if (!pembelianObat) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Pembelian obat not found',
      });
    }

    // Restore stok
    for (const detail of pembelianObat.detailPembelian) {
      const obat = await Obat.findByPk(detail.obat_id, { transaction: t });
      if (obat) {
        await obat.update(
          { stok: obat.stok - detail.jumlah },
          { transaction: t }
        );
      }
    }

    // Delete detail first
    await DetailPembelianObat.destroy({
      where: { pembelian_id: id },
      transaction: t,
    });

    // Delete pembelian
    await pembelianObat.destroy({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: 'Pembelian obat deleted successfully',
    });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting pembelian obat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pembelian obat',
      error: error.message,
    });
  }
};

module.exports = {
  getAllPembelianObat,
  getPembelianObatById,
  createPembelianObat,
  updatePembelianObat,
  deletePembelianObat,
};
