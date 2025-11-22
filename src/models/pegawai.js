'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pegawai extends Model {
    static associate(models) {
      // Relasi dengan User (optional - pegawai bisa punya akun user atau tidak)
      Pegawai.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // Relasi dengan Jabatan
      Pegawai.belongsTo(models.Jabatan, {
        foreignKey: 'jabatanId',
        as: 'jabatan',
      });

      // Relasi dengan UnitKerja (Divisi)
      Pegawai.belongsTo(models.UnitKerja, {
        foreignKey: 'unitKerjaId',
        as: 'unitKerja',
      });
    }

    // Method untuk menghitung usia
    getAge() {
      if (!this.tanggalLahir) return null;
      const today = new Date();
      const birthDate = new Date(this.tanggalLahir);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    }

    // Method untuk menghitung masa kerja (dalam tahun)
    getMasaKerja() {
      if (!this.tanggalMasuk) return null;
      const today = new Date();
      const joinDate = new Date(this.tanggalMasuk);
      let years = today.getFullYear() - joinDate.getFullYear();
      const monthDiff = today.getMonth() - joinDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < joinDate.getDate())
      ) {
        years--;
      }
      return years;
    }
  }

  Pegawai.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      nip: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
          msg: 'NIP already exists',
        },
        validate: {
          notNull: {
            msg: 'NIP is required',
          },
          notEmpty: {
            msg: 'NIP cannot be empty',
          },
        },
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Nama is required',
          },
          notEmpty: {
            msg: 'Nama cannot be empty',
          },
          len: {
            args: [3, 100],
            msg: 'Nama must be between 3 and 100 characters',
          },
        },
      },
      jenisKelamin: {
        type: DataTypes.ENUM('L', 'P'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Jenis kelamin is required',
          },
          isIn: {
            args: [['L', 'P']],
            msg: 'Jenis kelamin must be L or P',
          },
        },
      },
      tempatLahir: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tanggalLahir: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
          isDate: {
            msg: 'Tanggal lahir must be a valid date',
          },
        },
      },
      alamat: {
        type: DataTypes.TEXT,
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
        unique: {
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            msg: 'Must be a valid email address',
          },
        },
      },
      jabatanId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Jabatans',
          key: 'id',
        },
      },
      unitKerjaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'UnitKerjas',
          key: 'id',
        },
      },
      tanggalMasuk: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
          isDate: {
            msg: 'Tanggal masuk must be a valid date',
          },
        },
      },
      status: {
        type: DataTypes.ENUM('aktif', 'non-aktif', 'cuti'),
        allowNull: false,
        defaultValue: 'aktif',
        validate: {
          isIn: {
            args: [['aktif', 'non-aktif', 'cuti']],
            msg: 'Status must be aktif, non-aktif, or cuti',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Pegawai',
      tableName: 'Pegawais',
      timestamps: true,
    }
  );

  return Pegawai;
};
