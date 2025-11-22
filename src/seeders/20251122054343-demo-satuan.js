'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Satuans',
      [
        {
          id: 1,
          kode: 'STRIP',
          nama: 'Strip',
          deskripsi: 'Strip berisi 10 tablet/kapsul',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          kode: 'BOX',
          nama: 'Box',
          deskripsi: 'Kotak/dus',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          kode: 'BTL',
          nama: 'Botol',
          deskripsi: 'Botol untuk sirup/cairan',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          kode: 'TUBE',
          nama: 'Tube',
          deskripsi: 'Tube untuk salep/krim',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          kode: 'VIAL',
          nama: 'Vial',
          deskripsi: 'Vial untuk injeksi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          kode: 'AMP',
          nama: 'Ampul',
          deskripsi: 'Ampul untuk injeksi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          kode: 'SCH',
          nama: 'Sachet',
          deskripsi: 'Sachet untuk powder/bubuk',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          kode: 'PCS',
          nama: 'Pcs',
          deskripsi: 'Per piece/buah',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          kode: 'PACK',
          nama: 'Pack',
          deskripsi: 'Pack/kemasan',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('\"Satuans_id_seq\"', 9, true);"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Satuans', null, {});
  },
};
