'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Suppliers',
      [
        {
          id: 1,
          kode: 'SUP001',
          nama: 'PT Kimia Farma Trading',
          alamat: 'Jl. Veteran No. 9, Jakarta Pusat',
          kota: 'Jakarta',
          noTelp: '021-3841031',
          email: 'trading@kimiafarma.co.id',
          kontak: 'Divisi Trading',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          kode: 'SUP002',
          nama: 'PT Kalbe Farma',
          alamat: 'Jl. Letjen Suprapto, Cempaka Putih',
          kota: 'Jakarta',
          noTelp: '021-42873888',
          email: 'info@kalbe.co.id',
          kontak: 'Departemen Marketing',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          kode: 'SUP003',
          nama: 'PT Sanbe Farma',
          alamat: 'Jl. Soekarno Hatta No. 678',
          kota: 'Bandung',
          noTelp: '022-5400000',
          email: 'marketing@sanbe.co.id',
          kontak: 'Marketing Department',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          kode: 'SUP004',
          nama: 'PT Dexa Medica',
          alamat: 'Jl. Bambang Utoyo No. 138',
          kota: 'Palembang',
          noTelp: '0711-377288',
          email: 'info@dexa-medica.com',
          kontak: 'Customer Service',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          kode: 'SUP005',
          nama: 'PT Combiphar',
          alamat: 'Jl. Raya Simpang No. 1, Padalarang',
          kota: 'Bandung',
          noTelp: '022-6803636',
          email: 'info@combiphar.com',
          kontak: 'Sales Department',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('\"Suppliers_id_seq\"', 5, true);"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Suppliers', null, {});
  },
};
