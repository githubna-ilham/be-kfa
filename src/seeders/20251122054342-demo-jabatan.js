'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Jabatans',
      [
        {
          id: 1,
          kode: 'DIR',
          nama: 'Direktur',
          deskripsi: 'Direktur Apotek',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          kode: 'APJ',
          nama: 'Apoteker Penanggung Jawab',
          deskripsi: 'Apoteker yang bertanggung jawab atas operasional apotek',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          kode: 'APT',
          nama: 'Apoteker',
          deskripsi: 'Apoteker pelaksana',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          kode: 'AA',
          nama: 'Asisten Apoteker',
          deskripsi: 'Tenaga Teknis Kefarmasian',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          kode: 'KSR',
          nama: 'Kasir',
          deskripsi: 'Petugas kasir apotek',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          kode: 'GDG',
          nama: 'Staff Gudang',
          deskripsi: 'Petugas gudang obat',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          kode: 'ADM',
          nama: 'Staff Administrasi',
          deskripsi: 'Petugas administrasi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('\"Jabatans_id_seq\"', 7, true);"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Jabatans', null, {});
  },
};
