const express = require('express');
const router = express.Router();
const { Restaurant, Francesinha } = require('../models');
const { Op } = require('sequelize');

// Create a Restaurant
router.post('/', async (req, res) => {
  const { name, address, city, country, rating, francesinhas } = req.body;

  try {
    const restaurant = await Restaurant.create({ name, address, city, country, rating, francesinhas });

    if (francesinhas && francesinhas.length > 0) {
      const francesinhaInstances = await Francesinha.findAll({
        where: {
          id: francesinhas
        }
      });
      await restaurant.addFrancesinhas(francesinhaInstances);
    }

    const restaurantWithFrancesinhas = await Restaurant.findByPk(restaurant.id, {
      include: [{ model: Francesinha, as: 'Francesinhas' }]
    });

    res.status(201).send(restaurantWithFrancesinhas);
  } catch (error) {
    console.error('Error creating restaurant:', error.message);
    res.status(400).send({ message: 'Error creating restaurant', error: error.message });
  }
});

// Update a Restaurant by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, city, country, rating, francesinhas } = req.body;

  try {
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).send({ error: 'Restaurant not found' });
    }

    restaurant.name = name || restaurant.name;
    restaurant.address = address || restaurant.address;
    restaurant.city = city || restaurant.city;
    restaurant.country = country || restaurant.country;
    restaurant.rating = rating || restaurant.rating;
    restaurant.francesinhas = francesinhas || restaurant.francesinhas;

    await restaurant.save();

    res.send(restaurant);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a Restaurant by ID (Soft Delete)
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.update({ deleted: true }, { where: { id: req.params.id } });
    if (restaurant[0] === 1) {
      res.status(200).send({ message: 'Restaurant soft deleted successfully.' });
    } else {
      res.status(404).send({ message: 'Restaurant not found.' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Recover a soft deleted Restaurant by ID
router.put('/recover/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.update({ deleted: false }, { where: { id: req.params.id } });
    if (restaurant[0] === 1) {
      res.send({ message: 'Restaurant recovered successfully.' });
    } else {
      res.status(404).send({ message: 'Restaurant not found.' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all Restaurants with optional sorting and filtering
router.get('/', async (req, res) => {
  const { q, sortBy = 'name', order = 'asc', includeDeleted = 'false', page = '1', limit = 'false' } = req.query;
  const allowedSortFields = ['name', 'address', 'city', 'country', 'rating'];
  const allowedOrders = ['asc', 'desc'];

  if (!allowedSortFields.includes(sortBy) || !allowedOrders.includes(order)) {
    return res.status(400).send({ message: 'Invalid sort field or order' });
  }

  try {
    const whereClause = { deleted: includeDeleted === 'true' ? true : false };
    if (q) {
      whereClause.name = { [Op.like]: `%${q}%` };
    }
    if (page == 0) return res.status(400).send({ message: 'Invalid page number' });

    if (limit == 'false') {
      Restaurant.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order.toUpperCase()]],
        include: Francesinha,
        limit: 50,
      }).then((restaurants) => {
          res.send(restaurants);
        });
    } else {
      const count = await Restaurant.count({
        where: whereClause
      });
      Restaurant.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order.toUpperCase()]],
        include: Francesinha,
        limit: Number(limit),
        offset: (page - 1) * limit,
      }).then((restaurants) => {
          restaurants.page = Number(page);
          restaurants.maxPage = Math.ceil(count / limit);
          res.send(restaurants);
        });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
