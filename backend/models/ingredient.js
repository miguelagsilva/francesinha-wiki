const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ingredient = sequelize.define('Ingredient', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, 
        len: [1, 100]
      }
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  });

  Ingredient.associate = (models) => {
    Ingredient.belongsToMany(models.Francesinha, { through: 'FrancesinhaIngredient' })
  };

  return Ingredient;
};
