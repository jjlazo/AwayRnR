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
        firstName: 'KK',
        lastName: 'Slider',
        email: 'kkslider@crossing.com',
        username: 'KK-Slider',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
        firstName: 'Tom',
        lastName: 'Nook',
        email: 'tomnook@crossing.com',
        username: 'TomNook',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
        firstName: 'Chadder',
        lastName: 'Cheese',
        email: 'chadder@crossing.com',
        username: 'sharpChad',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
        firstName: 'Isabelle',
        lastName: 'Hisho',
        email: 'isabelle@crossing.com',
        username: 'IsABelle',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
        firstName: 'Celeste',
        lastName: 'Hoot',
        email: 'starryowl@crossing.com',
        username: 'Celesti-Owl',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
        firstName: 'Flick',
        lastName: 'Bugnir',
        email: 'iheartbugs@crossing.com',
        username: 'tooQuickFlick',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
        firstName: 'Harv',
        lastName: 'Hound',
        email: 'rvlife4ever@crossing.com',
        username: 'Harv',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
        firstName: 'Ankha',
        lastName: 'Set',
        email: 'ankha@crossing.com',
        username: 'QueenAnkha',
        hashedPassword: bcrypt.hashSync('password')
    },
    {
        firstName: 'Willy',
        lastName: 'Shakes',
        email: 'words@words.words',
        username: 'WillyShakes3',
        hashedPassword: bcrypt.hashSync('password2')
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
