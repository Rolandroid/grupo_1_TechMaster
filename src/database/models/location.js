'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.belongsTo(models.User,{
        as : 'user',
        foreignKey : 'userId',
        onDelete : 'cascade'
      })// define association here
    }
  }
  Location.init({
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    userId: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};