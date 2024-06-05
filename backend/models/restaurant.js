const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 100], notEmpty: true }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 255], notEmpty: true }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 100], notEmpty: true }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [1, 100], notEmpty: true }
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Restaurant.associate = (models) => {
    //Restaurant.hasMany(models.Francesinha, { as: 'francesinhas', foreignKey: 'restaurantId' });
    Restaurant.belongsToMany(models.Francesinha, { through: 'RestaurantFrancesinha' });
  };

  return Restaurant;
};
