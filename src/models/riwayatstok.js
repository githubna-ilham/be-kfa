'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiwayatStok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RiwayatStok.belongsTo(models.Obat, {
        foreignKey: 'obatId',
        as: 'obat'
      });
      RiwayatStok.belongsTo(models.Pegawai, {
        foreignKey: 'createdBy',
        as: 'pegawai'
      });
    }
  }
  RiwayatStok.init({
    obatId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jenisMutasi: {
      type: DataTypes.ENUM('masuk', 'keluar', 'adjustment', 'expired', 'rusak', 'retur'),
      allowNull: false
    },
    referensiId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    referensiTipe: {
      type: DataTypes.ENUM('pembelian', 'penjualan', 'adjustment', 'lainnya'),
      allowNull: true
    },
    qtyMasuk: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    qtyKeluar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    stokSebelum: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    stokSesudah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tanggalMutasi: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'RiwayatStok',
  });
  return RiwayatStok;
};