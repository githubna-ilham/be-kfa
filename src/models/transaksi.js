'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaksi.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer'
      });
      Transaksi.belongsTo(models.Pegawai, {
        foreignKey: 'pegawaiId',
        as: 'pegawai'
      });
      Transaksi.hasMany(models.DetailTransaksi, {
        foreignKey: 'transaksiId',
        as: 'details'
      });
    }
  }
  Transaksi.init({
    noFaktur: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    tanggalTransaksi: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pegawaiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalHarga: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    diskon: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    grandTotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    metodePembayaran: {
      type: DataTypes.ENUM('Cash', 'Transfer', 'Debit', 'Kredit', 'QRIS'),
      allowNull: false,
      defaultValue: 'Cash'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Transaksi',
  });
  return Transaksi;
};