'use strict';

/** @type {import('sequelize-cli').Migration} */


module.exports = {
  async up (queryInterface, Sequelize) {
 
  await queryInterface.bulkInsert('Categories', [
    {
      name : "Auricular",
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      name : "Monitor",
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      name : "Mouse",
      createdAt : new Date(),
      updatedAt : new Date(),
    },
    {
      name : "Teclado",
      createdAt : new Date(),
      updatedAt : new Date(),
    },
], {});
 
  },

  async down (queryInterface, Sequelize) {

  await queryInterface.bulkDelete('Categories', null, {});
  
  }
};
