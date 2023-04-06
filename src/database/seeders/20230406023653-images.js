'use strict';

/** @type {import('sequelize-cli').Migration} */


const productsJson = require('../../data/products.json')

let images_db = [];

productsJson.forEach(({id,image}) => {
  images_db = [...images_db,...image.map(image =>{
    return{
      name:image,
      productId: id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })]
});


module.exports = {
  async up (queryInterface, Sequelize) {
   
   await queryInterface.bulkInsert('Images', images_db, {});
   
  },

  async down (queryInterface, Sequelize) {
  
   await queryInterface.bulkDelete('Images', null, {});
   
  }
};
