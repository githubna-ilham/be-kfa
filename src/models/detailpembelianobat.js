'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailPembelianObat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailPembelianObat.belongsTo(models.PembelianObat, {
        foreignKey: 'pembelianObatId',
        as: 'pembelianObat'
      });
      DetailPembelianObat.belongsTo(models.Obat, {
        foreignKey: 'obatId',
        as: 'obat'
      });
    }
  }
  DetailPembelianObat.init({
    pembelianObatId: {
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
    hargaBeli: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    tanggalKadaluarsa: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    noBatch: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'DetailPembelianObat',
    hooks: {
      afterCreate: async (detail, options) => {
        const { Obat, RiwayatStok } = sequelize.models;

        // Get current stock
        const obat = await Obat.findByPk(detail.obatId, { transaction: options.transaction });
        if (!obat) return;

        const stokSebelum = obat.stok;
        const stokSesudah = stokSebelum + detail.qty;

        // Update stock
        await obat.update({ stok: stokSesudah }, { transaction: options.transaction });

        // Get pembelianObat to get pegawaiId
        const pembelianObat = await sequelize.models.PembelianObat.findByPk(
          detail.pembelianObatId,
          { transaction: options.transaction }
        );

        // Create stock history
        await RiwayatStok.create({
          obatId: detail.obatId,
          jenisMutasi: 'masuk',
          referensiId: detail.pembelianObatId,
          referensiTipe: 'pembelian',
          qtyMasuk: detail.qty,
          qtyKeluar: 0,
          stokSebelum: stokSebelum,
          stokSesudah: stokSesudah,
          keterangan: `Pembelian obat - Batch: ${detail.noBatch || '-'}`,
          tanggalMutasi: new Date(),
          createdBy: pembelianObat ? pembelianObat.pegawaiId : null
        }, { transaction: options.transaction });
      },

      afterUpdate: async (detail, options) => {
        if (detail.changed('qty')) {
          const { Obat, RiwayatStok } = sequelize.models;

          const obat = await Obat.findByPk(detail.obatId, { transaction: options.transaction });
          if (!obat) return;

          const qtyDiff = detail.qty - detail._previousDataValues.qty;
          const stokSebelum = obat.stok;
          const stokSesudah = stokSebelum + qtyDiff;

          await obat.update({ stok: stokSesudah }, { transaction: options.transaction });

          const pembelianObat = await sequelize.models.PembelianObat.findByPk(
            detail.pembelianObatId,
            { transaction: options.transaction }
          );

          await RiwayatStok.create({
            obatId: detail.obatId,
            jenisMutasi: qtyDiff > 0 ? 'masuk' : 'keluar',
            referensiId: detail.pembelianObatId,
            referensiTipe: 'pembelian',
            qtyMasuk: qtyDiff > 0 ? qtyDiff : 0,
            qtyKeluar: qtyDiff < 0 ? Math.abs(qtyDiff) : 0,
            stokSebelum: stokSebelum,
            stokSesudah: stokSesudah,
            keterangan: `Update pembelian obat - Batch: ${detail.noBatch || '-'}`,
            tanggalMutasi: new Date(),
            createdBy: pembelianObat ? pembelianObat.pegawaiId : null
          }, { transaction: options.transaction });
        }
      },

      beforeDestroy: async (detail, options) => {
        const { Obat, RiwayatStok } = sequelize.models;

        const obat = await Obat.findByPk(detail.obatId, { transaction: options.transaction });
        if (!obat) return;

        const stokSebelum = obat.stok;
        const stokSesudah = stokSebelum - detail.qty;

        await obat.update({ stok: stokSesudah }, { transaction: options.transaction });

        const pembelianObat = await sequelize.models.PembelianObat.findByPk(
          detail.pembelianObatId,
          { transaction: options.transaction }
        );

        await RiwayatStok.create({
          obatId: detail.obatId,
          jenisMutasi: 'keluar',
          referensiId: detail.pembelianObatId,
          referensiTipe: 'pembelian',
          qtyMasuk: 0,
          qtyKeluar: detail.qty,
          stokSebelum: stokSebelum,
          stokSesudah: stokSesudah,
          keterangan: `Hapus pembelian obat - Batch: ${detail.noBatch || '-'}`,
          tanggalMutasi: new Date(),
          createdBy: pembelianObat ? pembelianObat.pegawaiId : null
        }, { transaction: options.transaction });
      }
    }
  });
  return DetailPembelianObat;
};