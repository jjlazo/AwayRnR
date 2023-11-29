'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'ThisIs',
        lastName: 'AName',
        email: 'thisisan@email.com',
        username: 'ThisIsaUserName',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Willy',
        lastName: 'Shakes',
        email: 'words@words.words',
        username: 'WillyShakes3',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Fergie',
        lastName: 'Bananas',
        email: 'banana@banana.banana',
        username: 'Bananas4Bananas',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['ThisIsaUserName', 'WillyShakes3', 'Bananas4Bananas'] }
    }, {});
  }
};
