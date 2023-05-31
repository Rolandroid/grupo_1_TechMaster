'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

     /*  User.hasOne(models.Location,{
        as : 'location',
        foreignKey : 'locationId',
        onDelete : 'cascade'
      }), */
      User.hasMany(models.Order,{
        foreignKey:'userId',
        as:'orders'
      })

      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    socialId: DataTypes.STRING,
    socialProvider: DataTypes.STRING,
    rolId: { type: DataTypes.INTEGER, defaultValue: 2 },
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};