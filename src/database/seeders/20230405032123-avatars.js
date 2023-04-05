'use strict';

const { readJSON } = require('../../data');

/** @type {import('sequelize-cli').Migration} */

const users = readJSON('users.json');

const avatars = users.map(({id,avatar}) => {

 return { 
  name:avatar,
  createdAt: new Date(),
  updatedAt: new Date(),
}
});

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Avatars',avatars, {});
    
  },

  async down (queryInterface, Sequelize) {
  
   await queryInterface.bulkDelete('Avatars', null, {});
   
  }
};
