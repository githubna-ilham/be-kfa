'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PembelianObats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      noFaktur: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      tanggalPembelian: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      supplierId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Suppliers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      pegawaiId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pegawais',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      totalHarga: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      diskon: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      grandTotal: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('PembelianObats', ['noFaktur']);
    await queryInterface.addIndex('PembelianObats', ['tanggalPembelian']);
    await queryInterface.addIndex('PembelianObats', ['supplierId']);
    await queryInterface.addIndex('PembelianObats', ['pegawaiId']);
    await queryInterface.addIndex('PembelianObats', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PembelianObats');
  }
};
