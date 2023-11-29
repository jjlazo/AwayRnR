'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: "2021-11-20",
        endDate: "2021-11-23"
      },
      {
        spotId: 2,
        userId: 3,
        startDate: "2021-11-13",
        endDate: "2021-11-20"
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2021-12-5',
        endDate: "2021-12-10"
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['1', '2', '3'] }
    }, {});
  }
};
