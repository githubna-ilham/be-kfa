'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UnitKerja extends Model {
    static associate(models) {
      // Relasi dengan Pegawai
      UnitKerja.hasMany(models.Pegawai, {
        foreignKey: 'unitKerjaId',
        as: 'pegawai',
      });
    }
  }

  UnitKerja.init(
    {
      kode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          msg: 'Kode unit kerja already exists',
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
      modelName: 'UnitKerja',
      tableName: 'UnitKerjas',
      timestamps: true,
    }
  );

  return UnitKerja;
};
