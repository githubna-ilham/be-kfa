'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Description of the action performed',
      },
      method: {
        type: Sequelize.STRING(10),
        allowNull: false,
        comment: 'HTTP method (GET, POST, PUT, DELETE)',
      },
      endpoint: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'API endpoint accessed',
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP address of the client',
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'User agent string',
      },
      request_body: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Request body in JSON format',
      },
      query_params: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Query parameters in JSON format',
      },
      response_status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'HTTP response status code',
      },
      response_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Response time in milliseconds',
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Error message if any',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('activity_logs', ['user_id']);
    await queryInterface.addIndex('activity_logs', ['method']);
    await queryInterface.addIndex('activity_logs', ['endpoint']);
    await queryInterface.addIndex('activity_logs', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_logs');
  },
};
