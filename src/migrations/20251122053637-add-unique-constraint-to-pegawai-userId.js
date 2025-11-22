'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove existing non-unique index
    await queryInterface.removeIndex('Pegawais', ['userId']);

    // Add unique constraint to userId
    await queryInterface.addConstraint('Pegawais', {
      fields: ['userId'],
      type: 'unique',
      name: 'unique_user_id_pegawai',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove unique constraint
    await queryInterface.removeConstraint('Pegawais', 'unique_user_id_pegawai');

    // Add back non-unique index
    await queryInterface.addIndex('Pegawais', ['userId']);
  },
};
