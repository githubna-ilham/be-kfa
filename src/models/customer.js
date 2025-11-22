'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.hasMany(models.Transaksi, {
        foreignKey: 'customerId',
        as: 'transaksis'
      });
    }
  }
  Customer.init({
    kode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    noTelp: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    tanggalLahir: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    jenisKelamin: {
      type: DataTypes.ENUM('L', 'P'),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};