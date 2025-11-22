'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Obat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Obat.belongsTo(models.KategoriObat, {
        foreignKey: 'kategoriObatId',
        as: 'kategoriObat'
      });
      Obat.belongsTo(models.GolonganObat, {
        foreignKey: 'golonganObatId',
        as: 'golonganObat'
      });
      Obat.belongsTo(models.BentukSediaan, {
        foreignKey: 'bentukSediaanId',
        as: 'bentukSediaan'
      });
      Obat.belongsTo(models.Satuan, {
        foreignKey: 'satuanId',
        as: 'satuan'
      });
      Obat.belongsTo(models.Supplier, {
        foreignKey: 'supplierId',
        as: 'supplier'
      });
      Obat.hasMany(models.DetailTransaksi, {
        foreignKey: 'obatId',
        as: 'detailTransaksis'
      });
      Obat.hasMany(models.DetailPembelianObat, {
        foreignKey: 'obatId',
        as: 'detailPembelianObats'
      });
      Obat.hasMany(models.RiwayatStok, {
        foreignKey: 'obatId',
        as: 'riwayatStoks'
      });
    }
  }
  Obat.init({
    kodeObat: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    namaObat: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    kategoriObatId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    golonganObatId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bentukSediaanId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    satuanId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    stokMinimal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    },
    hargaBeli: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    hargaJual: {
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
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Obat',
  });
  return Obat;
};