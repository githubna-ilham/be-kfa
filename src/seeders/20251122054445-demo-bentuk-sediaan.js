'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'BentukSediaans',
      [
        {
          id: 1,
          kode: 'TBL',
          nama: 'Tablet',
          deskripsi: 'Sediaan padat berbentuk tablet',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          kode: 'KPS',
          nama: 'Kapsul',
          deskripsi: 'Sediaan dalam bentuk kapsul',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          kode: 'SRP',
          nama: 'Sirup',
          deskripsi: 'Sediaan cair manis',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          kode: 'SLP',
          nama: 'Salep',
          deskripsi: 'Sediaan semi solid untuk pemakaian luar',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          kode: 'KRM',
          nama: 'Krim',
          deskripsi: 'Sediaan semi solid berbentuk krim',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          kode: 'INJ',
          nama: 'Injeksi',
          deskripsi: 'Sediaan steril untuk suntikan',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          kode: 'TTS',
          nama: 'Tetes',
          deskripsi: 'Sediaan dalam bentuk tetes',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          kode: 'INH',
          nama: 'Inhaler',
          deskripsi: 'Sediaan untuk inhalasi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 9,
          kode: 'SUP',
          nama: 'Supositoria',
          deskripsi: 'Sediaan padat untuk rektal/vaginal',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          kode: 'PWD',
          nama: 'Powder',
          deskripsi: 'Sediaan dalam bentuk bubuk',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('\"BentukSediaans_id_seq\"', 10, true);"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BentukSediaans', null, {});
  },
};
