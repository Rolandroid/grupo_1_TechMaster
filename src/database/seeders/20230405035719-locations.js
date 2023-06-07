'use strict';

/** @type {import('sequelize-cli').Migration} */

const users = require('../../data/users.json');

const location =  [{

    address:"Calle 111",
    city: "Cordoba",
    province: "Cordoba",
    zipCode: "1324",
    userId : 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    address: "Avenida 123",
    city: "Lanus",
    province: "Buenos Aires",
    zipCode: 321,
    userId : 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  }];


module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Locations', location, {});

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Locations', null, {});

  }
};
