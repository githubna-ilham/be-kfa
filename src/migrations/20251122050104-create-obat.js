'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Obats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kodeObat: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      namaObat: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      kategoriObatId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'KategoriObats',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      golonganObatId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'GolonganObats',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      bentukSediaanId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'BentukSediaans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      satuanId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Satuans',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      supplierId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Suppliers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stokMinimal: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      hargaBeli: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      hargaJual: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      tanggalKadaluarsa: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      noBatch: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    // Add indexes
    await queryInterface.addIndex('Obats', ['kodeObat']);
    await queryInterface.addIndex('Obats', ['namaObat']);
    await queryInterface.addIndex('Obats', ['kategoriObatId']);
    await queryInterface.addIndex('Obats', ['golonganObatId']);
    await queryInterface.addIndex('Obats', ['supplierId']);
    await queryInterface.addIndex('Obats', ['isActive']);
    await queryInterface.addIndex('Obats', ['stok']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Obats');
  }
};
