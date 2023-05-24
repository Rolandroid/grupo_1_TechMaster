'use strict';

/** @type {import('sequelize-cli').Migration} */

const bcryptjs = require('bcryptjs')

module.exports = {
  async up (queryInterface, Sequelize) {
 
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name : "Admin",
          surname : "Test",
          email : "admin@test.com",
          password : '$2a$10$schew/Gg1Yr5CiWrj74CX.G7MEukzK91F.RI53W4QManbJLLgILkO',
          avatar : null,
          rolId : 1,
          createdAt : new Date(),
          updatedAt : new Date(),
        },
        {
          name : "User",
          surname : "Test",
          email : "user@test.com",
          password : bcryptjs.hashSync('123123',10),
          avatar : null,
          rolId : 2,
          createdAt : new Date(),
          updatedAt : new Date(),
        },
      
      ],
      {}
    );
  },
   
  

  async down (queryInterface, Sequelize) {
   
   await queryInterface.bulkDelete('Users', null, {});
   
  }
};
