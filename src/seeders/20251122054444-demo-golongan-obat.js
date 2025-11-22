'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'GolonganObats',
      [
        {
          id: 1,
          kode: 'ANLG',
          nama: 'Analgesik',
          deskripsi: 'Obat pereda nyeri',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          kode: 'ANTP',
          nama: 'Antipiretik',
          deskripsi: 'Obat penurun panas/demam',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          kode: 'ANTB',
          nama: 'Antibiotik',
          deskripsi: 'Obat untuk infeksi bakteri',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          kode: 'ANTH',
          nama: 'Antihistamin',
          deskripsi: 'Obat anti alergi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          kode: 'ANTD',
          nama: 'Antidiabetik',
          deskripsi: 'Obat untuk diabetes',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          kode: 'ANTN',
          nama: 'Antihipertensi',
          deskripsi: 'Obat untuk tekanan darah tinggi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          kode: 'VIT',
          nama: 'Vitamin',
          deskripsi: 'Suplemen vitamin dan mineral',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          kode: 'ANTS',
          nama: 'Antasida',
          deskripsi: 'Obat untuk gangguan lambung',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          kode: 'ANTT',
          nama: 'Antitusif',
          deskripsi: 'Obat batuk',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          kode: 'KRTK',
          nama: 'Kortikosteroid',
          deskripsi: 'Obat anti inflamasi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('\"GolonganObats_id_seq\"', 10, true);"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('GolonganObats', null, {});
  },
};
