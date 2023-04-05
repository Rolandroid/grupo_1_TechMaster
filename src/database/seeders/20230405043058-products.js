'use strict';

/** @type {import('sequelize-cli').Migration} */

const productsJson = require('../../data/products.json')

function getCategoryID(category) {
  switch (category) {
    case 'Auricular':
      return 1;
    case 'Monitor':
      return 2;
    case 'Mouse':
      return 3;
    default:
      return 4;
  }
}

const products = productsJson.map(({name,price,description,discount,category}) =>{
  return {
    name,
    price,
    description,
    discount,
    categoryId: getCategoryID(category),
    createdAt: new Date(),
    updatedAt: new Date()
  }
})

module.exports = {
  async up (queryInterface, Sequelize) {

   await queryInterface.bulkInsert('Products',products, {});

  },

  async down (queryInterface, Sequelize) {

   await queryInterface.bulkDelete('Products', null, {});

  }
};