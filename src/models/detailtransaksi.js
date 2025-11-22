'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailTransaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailTransaksi.belongsTo(models.Transaksi, {
        foreignKey: 'transaksiId',
        as: 'transaksi'
      });
      DetailTransaksi.belongsTo(models.Obat, {
        foreignKey: 'obatId',
        as: 'obat'
      });
    }
  }
  DetailTransaksi.init({
    transaksiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    obatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    hargaSatuan: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    diskon: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'DetailTransaksi',
    hooks: {
      afterCreate: async (detail, options) => {
        const { Obat, RiwayatStok } = sequelize.models;

        // Get current stock
        const obat = await Obat.findByPk(detail.obatId, { transaction: options.transaction });
        if (!obat) return;

        const stokSebelum = obat.stok;
        const stokSesudah = stokSebelum - detail.qty;

        // Update stock (reduce for sales)
        await obat.update({ stok: stokSesudah }, { transaction: options.transaction });

        // Get transaksi to get pegawaiId
        const transaksi = await sequelize.models.Transaksi.findByPk(
          detail.transaksiId,
          { transaction: options.transaction }
        );

        // Create stock history
        await RiwayatStok.create({
          obatId: detail.obatId,
          jenisMutasi: 'keluar',
          referensiId: detail.transaksiId,
          referensiTipe: 'penjualan',
          qtyMasuk: 0,
          qtyKeluar: detail.qty,
          stokSebelum: stokSebelum,
          stokSesudah: stokSesudah,
          keterangan: `Penjualan obat - Faktur: ${transaksi ? transaksi.noFaktur : '-'}`,
          tanggalMutasi: new Date(),
          createdBy: transaksi ? transaksi.pegawaiId : null
        }, { transaction: options.transaction });
      },

      afterUpdate: async (detail, options) => {
        if (detail.changed('qty')) {
          const { Obat, RiwayatStok } = sequelize.models;

          const obat = await Obat.findByPk(detail.obatId, { transaction: options.transaction });
          if (!obat) return;

          const qtyDiff = detail.qty - detail._previousDataValues.qty;
          const stokSebelum = obat.stok;
          const stokSesudah = stokSebelum - qtyDiff;

          await obat.update({ stok: stokSesudah }, { transaction: options.transaction });

          const transaksi = await sequelize.models.Transaksi.findByPk(
            detail.transaksiId,
            { transaction: options.transaction }
          );

          await RiwayatStok.create({
            obatId: detail.obatId,
            jenisMutasi: qtyDiff > 0 ? 'keluar' : 'masuk',
            referensiId: detail.transaksiId,
            referensiTipe: 'penjualan',
            qtyMasuk: qtyDiff < 0 ? Math.abs(qtyDiff) : 0,
            qtyKeluar: qtyDiff > 0 ? qtyDiff : 0,
            stokSebelum: stokSebelum,
            stokSesudah: stokSesudah,
            keterangan: `Update penjualan obat - Faktur: ${transaksi ? transaksi.noFaktur : '-'}`,
            tanggalMutasi: new Date(),
            createdBy: transaksi ? transaksi.pegawaiId : null
          }, { transaction: options.transaction });
        }
      },

      beforeDestroy: async (detail, options) => {
        const { Obat, RiwayatStok } = sequelize.models;

        const obat = await Obat.findByPk(detail.obatId, { transaction: options.transaction });
        if (!obat) return;

        const stokSebelum = obat.stok;
        const stokSesudah = stokSebelum + detail.qty;

        await obat.update({ stok: stokSesudah }, { transaction: options.transaction });

        const transaksi = await sequelize.models.Transaksi.findByPk(
          detail.transaksiId,
          { transaction: options.transaction }
        );

        await RiwayatStok.create({
          obatId: detail.obatId,
          jenisMutasi: 'masuk',
          referensiId: detail.transaksiId,
          referensiTipe: 'penjualan',
          qtyMasuk: detail.qty,
          qtyKeluar: 0,
          stokSebelum: stokSebelum,
          stokSesudah: stokSesudah,
          keterangan: `Hapus penjualan obat - Faktur: ${transaksi ? transaksi.noFaktur : '-'}`,
          tanggalMutasi: new Date(),
          createdBy: transaksi ? transaksi.pegawaiId : null
        }, { transaction: options.transaction });
      }
    }
  });
  return DetailTransaksi;
};