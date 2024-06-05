const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Francesinha = sequelize.define('Francesinha', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, 
        len: [1, 100]
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true, 
        min: 0, 
      }
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      }
    },
    photos: {
      type: DataTypes.JSON
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  });

  Francesinha.associate = (models) => {
    Francesinha.belongsToMany(models.Restaurant, { through: 'RestaurantFrancesinha' })
    Francesinha.belongsToMany(models.Ingredient, { through: 'FrancesinhaIngredient' })
  };

  return Francesinha;
};
