'use strict';
const {
  Model
} = require('sequelize');
const sequelizePaginate = require('sequelize-paginate')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Image,{
        as : 'images',
        foreignKey : 'productId',
        onDelete : 'cascade'
      }),
      Product.belongsTo(models.Category,{
        as : 'category',
        foreignKey : 'categoryId'
      }),
      Product.belongsToMany(models.Order,{
        through: 'Cart',
        foreignKey:'productId',
        otherKey:'orderId',
        as: 'cart'
      })
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    discount: DataTypes.INTEGER,
    visible: DataTypes.BOOLEAN,
    categoryId: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'Product',
  });
  sequelizePaginate.paginate(Product)
  return Product;
};