'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaksis', {
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
      tanggalTransaksi: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      metodePembayaran: {
        type: Sequelize.ENUM('Cash', 'Transfer', 'Debit', 'Kredit', 'QRIS'),
        allowNull: false,
        defaultValue: 'Cash'
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
    await queryInterface.addIndex('Transaksis', ['noFaktur']);
    await queryInterface.addIndex('Transaksis', ['tanggalTransaksi']);
    await queryInterface.addIndex('Transaksis', ['customerId']);
    await queryInterface.addIndex('Transaksis', ['pegawaiId']);
    await queryInterface.addIndex('Transaksis', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transaksis');
  }
};
