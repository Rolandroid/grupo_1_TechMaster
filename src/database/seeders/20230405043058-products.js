'use strict';

/** @type {import('sequelize-cli').Migration} */

const productsJson = require('../../data/products.json')

const products = productsJson.map(({name, price, description, discount, category}) => {
  const categoryIDs = {
    'Auricular': 1,
    'Monitor': 2,
    'Mouse': 3,
    'Teclado': 4
  };
  return {
    name,
    price,
    description,
    discount,
    categoryId: categoryIDs[category] ,
    createdAt: new Date(),
    updatedAt: new Date()
  }
});
module.exports = {
  async up (queryInterface, Sequelize) {

   await queryInterface.bulkInsert('Products',products, {});

  },

  async down (queryInterface, Sequelize) {

   await queryInterface.bulkDelete('Products', null, {});

  }
};