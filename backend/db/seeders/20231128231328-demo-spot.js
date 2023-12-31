'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 3,
        address: '123 Animal Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Chez Cheddar",
        description: "The Cheeziest Place Around!",
        price: 79
      },
      {
        ownerId: 1,
        address: '456 Doggie Drive',
        city: 'San Diego',
        state: 'California',
        country: 'United States of America',
        lat: 32.3646578,
        lng: -111.4730327,
        name: "Hound House Kick",
        description: "Dog friendly, music lover's dream.",
        price: 456
      },
      {
        ownerId: 4,
        address: '789 Arachnid Rd',
        city: 'Dallas',
        state: 'Texas',
        country: 'United States of America',
        lat: 23.7645358,
        lng: -117.6730327,
        name: "SPIDER ISLAND",
        description: "net advised",
        price: 123
      },
      {
        ownerId: 5,
        address: '624 Starry Ln',
        city: 'Dallas',
        state: 'Texas',
        country: 'United States of America',
        lat: 23.7345650,
        lng: -117.6230427,
        name: "Stargazer's Roost",
        description: "Telescope available!",
        price: 123
      },
      {
        ownerId: 6,
        address: '907 Snail Slope St',
        city: 'Ocala',
        state: 'Florida',
        country: 'United States of America',
        lat: 23.7543358,
        lng: -117.6098327,
        name: "SCORPION ISLAND",
        description: "BRING MEDICINE",
        price: 123
      },
      {
        ownerId: 7,
        address: '321 Rowdy Ruff Rd',
        city: 'Dallas',
        state: 'Texas',
        country: 'United States of America',
        lat: 13.7645358,
        lng: -117.6730327,
        name: "HARV'S ISLAND",
        description: "Dog friendly, guitar available",
        price: 123
      },
      {
        ownerId: 2,
        address: '317 Bell Bag Drive',
        city: 'New York City',
        state: 'New York',
        country: 'United States of America',
        lat: 63.7645358,
        lng: -217.6730327,
        name: "Tom's Nook",
        description: "Quaint and quiet, a perfect island getaway!",
        price: 123
      },
      {
        ownerId: 8,
        address: '098 Feline Ln',
        city: 'Denver',
        state: 'Colorado',
        country: 'United States of America',
        lat: 13.7645358,
        lng: -117.6730327,
        name: "The Cat's Meow",
        description: "Bring offerings",
        price: 123
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'House of Mouse', 'Mojo Dojo Casa House'] }
    }, {});
  }
};
