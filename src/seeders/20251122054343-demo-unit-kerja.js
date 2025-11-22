'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'UnitKerjas',
      [
        {
          id: 1,
          kode: 'MNG',
          nama: 'Manajemen',
          deskripsi: 'Unit manajemen dan administrasi',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          kode: 'PLY-RSP',
          nama: 'Pelayanan Resep',
          deskripsi: 'Unit pelayanan resep dokter',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          kode: 'PLY-NRS',
          nama: 'Pelayanan Non-Resep',
          deskripsi: 'Unit pelayanan obat bebas dan OTC',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          kode: 'GDG',
          nama: 'Gudang',
          deskripsi: 'Unit pergudangan obat',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          kode: 'KEU',
          nama: 'Keuangan',
          deskripsi: 'Unit keuangan dan kasir',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          kode: 'FAR-KLN',
          nama: 'Farmasi Klinik',
          deskripsi: 'Unit konsultasi dan edukasi pasien',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.sequelize.query(
      "SELECT setval('\"UnitKerjas_id_seq\"', 6, true);"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UnitKerjas', null, {});
  },
};
