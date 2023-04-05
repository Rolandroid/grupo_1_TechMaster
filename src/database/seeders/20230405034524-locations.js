'use strict';

/** @type {import('sequelize-cli').Migration} */

const users = require('../../data/users.json');

const location = users.map(({}) => {

 return { 
  address:null,
  city:null,
  province:null,
  zipCode:null,
  createdAt: new Date(),
  updatedAt: new Date(),
}
});


module.exports = {
  async up (queryInterface, Sequelize) {
 
   await queryInterface.bulkInsert('Locations',location, {});
   
  },

  async down (queryInterface, Sequelize) {
   
   await queryInterface.bulkDelete('Locations', null, {});
   
  }
};
