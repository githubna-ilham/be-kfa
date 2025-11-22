'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Satuan extends Model {
    static associate(models) {
      // Relasi akan ditambahkan nanti ketika model Obat dibuat
      // Satuan.hasMany(models.Obat, { foreignKey: 'satuanId', as: 'obat' });
    }
  }

  Satuan.init(
    {
      kode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          msg: 'Kode satuan already exists',
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
      deskripsi: {
        type: DataTypes.TEXT,
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
      modelName: 'Satuan',
      tableName: 'Satuans',
      timestamps: true,
    }
  );

  return Satuan;
};
