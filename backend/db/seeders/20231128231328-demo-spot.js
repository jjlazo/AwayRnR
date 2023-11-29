'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 2,
        address: '456 Minnie Drive',
        city: 'San Diego',
        state: 'California',
        country: 'United States of America',
        lat: 32.3646578,
        lng: -111.4730327,
        name: "House of Mouse",
        description: "Where Mickey is king",
        price: 456
      },
      {
        ownerId: 3,
        address: '789 Barbie Rd',
        city: 'Dallas',
        state: 'Texas',
        country: 'United States of America',
        lat: 23.7645358,
        lng: -117.6730327,
        name: "Mojo Dojo Casa House",
        description: "it's kenough",
        price: 123
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'House of Mouse', 'Mojo Dojo Casa House'] }
    }, {});
  }
};
