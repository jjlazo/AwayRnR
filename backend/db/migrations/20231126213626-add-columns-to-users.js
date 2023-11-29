'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
options.tableName = 'Users';

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(options, 'firstName', {
      type: Sequelize.STRING(30)
    });

    await queryInterface.addColumn(options, 'lastName', {
      type: Sequelize.STRING(30)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, 'firstName');
    await queryInterface.removeColumn(options, 'lastName');
  }
};
