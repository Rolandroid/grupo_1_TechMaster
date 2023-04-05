'use strict';

/** @type {import('sequelize-cli').Migration} */

const productsJson = require('../../data/products.json')

const products = productsJson.map(({name,price,description,discount,category}) =>{
 /*  if (category === 'Auricular') {
    return 1
  }else if(category === 'Monitor'){
    return 2
  }else if(category === 'Mouse'){
    return 3
  }else{
    return 4
  }
 */
  return {
    name,
    price,
    description,
    discount,
    categoryId: category,
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
