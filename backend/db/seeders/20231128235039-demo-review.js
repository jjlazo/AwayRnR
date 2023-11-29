'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: 'wordswordswords',
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: 'BANANAS',
        stars: 2
      },
      {
        spotId: 3,
        userId: 1,
        review: 'sdrgiujbfdagbler',
        stars: 3
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
