'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Jabatan extends Model {
    static associate(models) {
      // Relasi dengan Pegawai
      Jabatan.hasMany(models.Pegawai, {
        foreignKey: 'jabatanId',
        as: 'pegawai',
      });
    }
  }

  Jabatan.init(
    {
      kode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
          msg: 'Kode jabatan already exists',
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
      modelName: 'Jabatan',
      tableName: 'Jabatans',
      timestamps: true,
    }
  );

  return Jabatan;
};
