'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PembelianObat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PembelianObat.belongsTo(models.Supplier, {
        foreignKey: 'supplierId',
        as: 'supplier'
      });
      PembelianObat.belongsTo(models.Pegawai, {
        foreignKey: 'pegawaiId',
        as: 'pegawai'
      });
      PembelianObat.hasMany(models.DetailPembelianObat, {
        foreignKey: 'pembelianObatId',
        as: 'details'
      });
    }
  }
  PembelianObat.init({
    noFaktur: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    tanggalPembelian: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    modelName: 'PembelianObat',
  });
  return PembelianObat;
};