'use strict';

const { Restaurant, Francesinha, Ingredient } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const restaurants = await Restaurant.bulkCreate([
      {
        name: 'A Tasquinha',
        address: 'Rua dos Pescadores 20',
        city: 'Coimbra',
        country: 'Portugal',
        rating: 4.8,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'O Cantinho',
        address: 'Avenida Central 15',
        city: 'Coimbra',
        country: 'Portugal',
        rating: 4.5,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Adega Típica',
        address: 'Largo da Sé Velha 4',
        city: 'Coimbra',
        country: 'Portugal',
        rating: 4.7,
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    const francesinhas = await Francesinha.bulkCreate([
      {
        name: 'Francesinha Tradicional',
        price: 9.5,
        rating: 4.9,
        photos: [
          { url: '/uploads/francesinha_tradicional_1.jpg' },
          { url: '/uploads/francesinha_tradicional_2.jpg' }
        ],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Francesinha de Frango',
        price: 8.0,
        rating: 4.7,
        photos: [
          { url: '/uploads/francesinha_frango_1.jpg' },
          { url: '/uploads/francesinha_frango_2.jpg' }
        ],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Francesinha Vegetariana',
        price: 7.5,
        rating: 4.6,
        photos: [
          { url: '/uploads/francesinha_vegetariana_1.jpg' },
          { url: '/uploads/francesinha_vegetariana_2.jpg' }
        ],
        deleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    const ingredients = await Ingredient.bulkCreate([
      { name: 'Pão', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Queijo', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fiambre', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Linguiça', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Salsicha', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Bife', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Molho de Francesinha', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Frango', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Legumes', createdAt: new Date(), updatedAt: new Date() }
    ], { returning: true });

    await francesinhas[0].addIngredients([
      ingredients[0], // Pão
      ingredients[1], // Queijo
      ingredients[2], // Fiambre
      ingredients[3], // Linguiça
      ingredients[4], // Salsicha
      ingredients[5], // Bife
      ingredients[6]  // Molho de Francesinha
    ]);

    await francesinhas[1].addIngredients([
      ingredients[0], // Pão
      ingredients[1], // Queijo
      ingredients[7], // Frango
      ingredients[6]  // Molho de Francesinha
    ]);

    await francesinhas[2].addIngredients([
      ingredients[0], // Pão
      ingredients[1], // Queijo
      ingredients[8], // Legumes
      ingredients[6]  // Molho de Francesinha
    ]);

    await restaurants[0].addFrancesinha(francesinhas[0]);
    await restaurants[0].addFrancesinha(francesinhas[1]);
    await restaurants[1].addFrancesinha(francesinhas[1]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RestaurantFrancesinha', null, {});
    await queryInterface.bulkDelete('FrancesinhaIngredient', null, {});
    await queryInterface.bulkDelete('Francesinhas', null, {});
    await queryInterface.bulkDelete('Ingredients', null, {});
    await queryInterface.bulkDelete('Restaurants', null, {});
  }
};
