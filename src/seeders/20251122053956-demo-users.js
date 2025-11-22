'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: 1,
          username: 'admin',
          email: 'admin@kfa.com',
          password: hashedPassword,
          fullName: 'Administrator',
          role: 'admin',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: 'dokter',
          email: 'dokter@kfa.com',
          password: hashedPassword,
          fullName: 'Dr. John Doe',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          username: 'apoteker',
          email: 'apoteker@kfa.com',
          password: hashedPassword,
          fullName: 'Apt. Jane Smith',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          username: 'kasir',
          email: 'kasir@kfa.com',
          password: hashedPassword,
          fullName: 'Kasir Apotek',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          username: 'gudang',
          email: 'gudang@kfa.com',
          password: hashedPassword,
          fullName: 'Staff Gudang',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Reset the sequence to start from 6
    await queryInterface.sequelize.query(
      "SELECT setval('\"Users_id_seq\"', 5, true);"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    // Reset the sequence
    await queryInterface.sequelize.query(
      "SELECT setval('\"Users_id_seq\"', 1, false);"
    );
  },
};
