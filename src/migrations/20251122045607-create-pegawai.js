'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pegawais', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      nip: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      nama: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      jenisKelamin: {
        type: Sequelize.ENUM('L', 'P'),
        allowNull: false
      },
      tempatLahir: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      tanggalLahir: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      noTelp: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
      },
      jabatanId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Jabatans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      unitKerjaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'UnitKerjas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tanggalMasuk: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('aktif', 'non-aktif', 'cuti'),
        allowNull: false,
        defaultValue: 'aktif'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('Pegawais', ['userId']);
    await queryInterface.addIndex('Pegawais', ['nip']);
    await queryInterface.addIndex('Pegawais', ['email']);
    await queryInterface.addIndex('Pegawais', ['jabatanId']);
    await queryInterface.addIndex('Pegawais', ['unitKerjaId']);
    await queryInterface.addIndex('Pegawais', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pegawais');
  }
};
