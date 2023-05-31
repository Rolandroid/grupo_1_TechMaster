'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Product,{
        through: 'Cart',
        foreignKey:'orderId',
        otherKey:'productId',
        as: 'cart'
      }),
      this.belongsTo(models.User,{
        foreignKey:'userId',
        as:'user'
      })
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    total:{type: DataTypes.INTEGER, defaultValue:0},
    date: {type:DataTypes.DATE,defaultValue:new Date()},
    status:{
      type:DataTypes.STRING,
      defaultValue:"pending",
      validate:{
        isIn:{
          args:[["pending","completed","canceled"]],
          msg:"Los valores validos son: pending, completed o canceled"
        }
        //DOC: https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};