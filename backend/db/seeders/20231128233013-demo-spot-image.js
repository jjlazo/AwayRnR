'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://dodo.ac/np/images/e/e8/House_of_Chadder_NL_Exterior.png',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://dodo.ac/np/images/f/ff/RV_of_K.K._Slider_NLWa_Exterior.png',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://cdn.mos.cms.futurecdn.net/BMwE72E288f9QgeRrmjvhg.jpg',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://dodo.ac/np/images/d/de/RV_of_Celeste_NLWa_Exterior.png',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://img.gamewith.net/article/thumbnail/rectangle/19265.png',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://dodo.ac/np/images/a/af/NH_Harv%27s_Island.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://dodo.ac/np/images/b/bf/RV_of_Tom_Nook_NLWa_Exterior.png',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://dodo.ac/np/images/f/fc/PG_Exterior_Islander.png',
        preview: true
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
