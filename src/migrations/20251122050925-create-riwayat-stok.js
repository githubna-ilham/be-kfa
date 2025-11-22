'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RiwayatStoks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      obatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Obats',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      jenisMutasi: {
        type: Sequelize.ENUM('masuk', 'keluar', 'adjustment', 'expired', 'rusak', 'retur'),
        allowNull: false
      },
      referensiId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'ID transaksi/pembelian yang terkait'
      },
      referensiTipe: {
        type: Sequelize.ENUM('pembelian', 'penjualan', 'adjustment', 'lainnya'),
        allowNull: true
      },
      qtyMasuk: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      qtyKeluar: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stokSebelum: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stokSesudah: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tanggalMutasi: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Pegawais',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('RiwayatStoks', ['obatId']);
    await queryInterface.addIndex('RiwayatStoks', ['jenisMutasi']);
    await queryInterface.addIndex('RiwayatStoks', ['referensiId', 'referensiTipe']);
    await queryInterface.addIndex('RiwayatStoks', ['tanggalMutasi']);
    await queryInterface.addIndex('RiwayatStoks', ['createdBy']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RiwayatStoks');
  }
};
