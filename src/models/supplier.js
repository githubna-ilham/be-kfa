'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    static associate(models) {
      // Relasi akan ditambahkan nanti
      // Supplier.hasMany(models.PembelianObat, { foreignKey: 'supplierId', as: 'pembelian' });
    }
  }

  Supplier.init(
    {
      kode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          msg: 'Kode supplier already exists',
        },
        validate: {
          notNull: { msg: 'Kode is required' },
          notEmpty: { msg: 'Kode cannot be empty' },
        },
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: { msg: 'Nama is required' },
          notEmpty: { msg: 'Nama cannot be empty' },
        },
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      kota: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      noTelp: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: {
            args: /^[0-9+()-\s]*$/,
            msg: 'No telp must contain only numbers and valid characters',
          },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: {
            msg: 'Must be a valid email address',
          },
        },
      },
      kontak: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'Suppliers',
      timestamps: true,
    }
  );

  return Supplier;
};
