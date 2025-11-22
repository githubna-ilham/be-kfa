const { PembelianObat, DetailPembelianObat, Supplier, Obat, Pegawai, User } = require('../models');
const { sequelize } = require('../models');
const { buildQueryOptions, formatPaginatedResponse } = require('../utils/pagination');

// Get all pembelian obat with pagination, search, and filters
const getAllPembelianObat = async (req, res) => {
  try {
    const queryOptions = buildQueryOptions(req, {
      searchFields: ['noFaktur', 'keterangan'],
      allowedFilters: ['supplierId', 'pegawaiId', 'status'],
      defaultSort: 'tanggalPembelian',
      dateFields: ['tanggalPembelian'],
    });

    // Override default sort to DESC for pembelian
    if (!req.query.sortOrder) {
      queryOptions.order = [['tanggalPembelian', 'DESC']];
    }

    const { count, rows } = await PembelianObat.findAndCountAll({
      where: queryOptions.where,
      limit: queryOptions.limit,
      offset: queryOptions.offset,
      order: queryOptions.order,
      include: [
        {
          model: Supplier,
          as: 'supplier',
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
          model: DetailPembelianObat,
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
          model: DetailPembelianObat,
          as: 'details',
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
      noFaktur,
      supplierId,
      pegawaiId,
      tanggalPembelian,
      diskon,
      status,
      keterangan,
      details,
      detailPembelian, // Support both naming
    } = req.body;

    // Use detailPembelian if details is not provided
    const pembelianDetails = details || detailPembelian;

    if (!supplierId || !pembelianDetails || pembelianDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Supplier ID and detail pembelian are required',
      });
    }

    // Get pegawaiId from logged-in user if not provided
    let finalPegawaiId = pegawaiId;
    if (!finalPegawaiId) {
      const pegawai = await Pegawai.findOne({
        where: { userId: req.user.id },
      });

      if (!pegawai) {
        return res.status(400).json({
          success: false,
          message: 'Pegawai data not found for current user. Please provide pegawaiId.',
        });
      }
      finalPegawaiId = pegawai.id;
    }

    // Calculate totalHarga from details
    let calculatedTotalHarga = 0;
    for (const detail of pembelianDetails) {
      // Support both hargaBeli/hargaSatuan and qty/jumlah
      const harga = detail.hargaBeli || detail.hargaSatuan || 0;
      const quantity = detail.qty || detail.jumlah || 0;
      const subtotal = detail.subtotal || (harga * quantity);
      calculatedTotalHarga += subtotal;
    }

    // Calculate grandTotal (totalHarga - diskon)
    const finalDiskon = diskon || 0;
    const calculatedGrandTotal = calculatedTotalHarga - finalDiskon;

    // Generate noFaktur if not provided
    const generatedNoFaktur = noFaktur || `PO-${Date.now()}`;

    // Create pembelian obat
    const pembelianObat = await PembelianObat.create(
      {
        noFaktur: generatedNoFaktur,
        supplierId,
        pegawaiId: finalPegawaiId,
        tanggalPembelian: tanggalPembelian || new Date(),
        totalHarga: calculatedTotalHarga,
        diskon: finalDiskon,
        grandTotal: calculatedGrandTotal,
        status: status || 'pending',
        keterangan,
      },
      { transaction: t }
    );

    // Create detail pembelian and update stok
    const detailPromises = pembelianDetails.map(async (detail) => {
      // Support both naming conventions
      const harga = detail.hargaBeli || detail.hargaSatuan || 0;
      const quantity = detail.qty || detail.jumlah || 0;

      // Validate obat exists
      const obat = await Obat.findByPk(detail.obatId, { transaction: t });
      if (!obat) {
        throw new Error(`Obat with ID ${detail.obatId} not found`);
      }

      // Note: Stok akan diupdate otomatis oleh hook afterCreate di model DetailPembelianObat
      // Tapi kita tetap update hargaBeli di master obat
      await obat.update(
        {
          hargaBeli: harga, // Update harga beli terakhir
        },
        { transaction: t }
      );

      // Calculate subtotal if not provided
      const calculatedSubtotal = detail.subtotal || (harga * quantity);

      return DetailPembelianObat.create(
        {
          pembelianObatId: pembelianObat.id,
          obatId: detail.obatId,
          qty: quantity,
          hargaBeli: harga,
          subtotal: calculatedSubtotal,
          tanggalKadaluarsa: detail.tanggalKadaluarsa,
          noBatch: detail.noBatch,
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
          model: DetailPembelianObat,
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
      supplierId,
      status,
      keterangan,
    } = req.body;

    const pembelianObat = await PembelianObat.findByPk(id);

    if (!pembelianObat) {
      return res.status(404).json({
        success: false,
        message: 'Pembelian obat not found',
      });
    }

    await pembelianObat.update({
      supplierId: supplierId !== undefined ? supplierId : pembelianObat.supplierId,
      status: status || pembelianObat.status,
      keterangan: keterangan !== undefined ? keterangan : pembelianObat.keterangan,
    });

    const pembelianWithRelations = await PembelianObat.findByPk(id, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
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
          model: DetailPembelianObat,
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
          as: 'details',
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

    // Note: Stok akan dikembalikan otomatis oleh hook beforeDestroy di model DetailPembelianObat
    // Tidak perlu manual update stok di sini

    // Delete detail first
    await DetailPembelianObat.destroy({
      where: { pembelianObatId: id },
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
