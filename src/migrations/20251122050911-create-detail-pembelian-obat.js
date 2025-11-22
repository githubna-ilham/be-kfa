'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailPembelianObats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pembelianObatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PembelianObats',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      obatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Obats',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      hargaBeli: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      subtotal: {
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
    await queryInterface.addIndex('DetailPembelianObats', ['pembelianObatId']);
    await queryInterface.addIndex('DetailPembelianObats', ['obatId']);
    await queryInterface.addIndex('DetailPembelianObats', ['tanggalKadaluarsa']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DetailPembelianObats');
  }
};
