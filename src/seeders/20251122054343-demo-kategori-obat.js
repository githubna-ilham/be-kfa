'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'KategoriObats',
      [
        {
          id: 1,
          kode: 'OBT-KRS',
          nama: 'Obat Keras',
          deskripsi: 'Obat yang hanya dapat diperoleh dengan resep dokter',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          kode: 'OBT-BBS-TBT',
          nama: 'Obat Bebas Terbatas',
          deskripsi: 'Obat yang dapat dibeli tanpa resep dengan tanda peringatan',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          kode: 'OBT-BBS',
          nama: 'Obat Bebas',
          deskripsi: 'Obat yang dapat dibeli bebas tanpa resep',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          kode: 'OBT-GNR',
          nama: 'Obat Generik',
          deskripsi: 'Obat dengan nama sesuai zat aktif',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          kode: 'OBT-PTN',
          nama: 'Obat Paten',
          deskripsi: 'Obat dengan nama dagang/brand',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          kode: 'ALK',
          nama: 'Alat Kesehatan',
          deskripsi: 'Alat kesehatan dan medis',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          kode: 'SUP',
          nama: 'Suplemen',
          deskripsi: 'Suplemen dan vitamin',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('\"KategoriObats_id_seq\"', 7, true);"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('KategoriObats', null, {});
  },
};
