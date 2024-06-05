const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Restaurant, Francesinha, Ingredient } = require('../models');
const { Op } = require('sequelize');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Create a Francesinha
router.post('/', upload.array('photos', 10), async (req, res) => {
  const { name, price, rating, ingredients, restaurants } = req.body;
  const photos = [];
  //const photos = req.files.map(file => file.filename);

  try {
    const francesinha = await Francesinha.create({ name, price, rating, photos });

    if (restaurants && restaurants.length > 0) {
      const restaurantInstances = await Restaurant.findAll({
        where: {
          id: restaurants
        }
      });
      await francesinha.addRestaurants(restaurantInstances);
    }
    console.log(ingredients);
    if (ingredients && ingredients.length > 0) {
      const ingredientInstances = await Ingredient.findAll({
        where: {
          id: ingredients
        }
      });
      await francesinha.addIngredients(ingredientInstances);
    }

    const francesinhaWithChildren = await Francesinha.findByPk(francesinha.id, {
      include: [{ model: Ingredient, as: 'Ingredients' }, { model: Restaurant, as: 'Restaurants' }]
    });

    res.status(201).send(francesinhaWithChildren);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update a Francesinha by ID
router.put('/:id', upload.array('photos', 10), async (req, res) => {
  const { id } = req.params;
  const { name, price, rating, ingredients, restaurants } = req.body;
  const photos = []
  //const photos = req.files.map(file => file.filename);

  try {
    const francesinha = await Francesinha.findByPk(id);

    if (!francesinha) {
      return res.status(404).send({ message: 'Francesinha not found' });
    }

    francesinha.name = name || francesinha.name;
    francesinha.price = price || francesinha.price;
    francesinha.rating = rating || francesinha.rating;
    francesinha.photos = photos.length > 0 ? photos : francesinha.photos;

    await francesinha.save();

    if (restaurants && restaurants.length > 0) {
      const restaurantInstances = await Restaurant.findAll({
        where: {
          id: restaurants
        }
      });
      await francesinha.setRestaurants(restaurantInstances);
    }
    if (ingredients && ingredients.length > 0) {
      const ingredientInstances = await Ingredient.findAll({
        where: {
          id: ingredients
        }
      });
      await francesinha.setIngredients(ingredientInstances);
    }

    const francesinhaWithChildren = await Francesinha.findByPk(francesinha.id, {
      include: [{ model: Ingredient, as: 'Ingredients' }, { model: Restaurant, as: 'Restaurants' }]
    });

    res.send(francesinhaWithChildren);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete a Francesinha by ID
router.delete('/:id', async (req, res) => {
  try {
    const francesinha = await Francesinha.update({ deleted: true }, { where: { id: req.params.id } });
    if (francesinha[0] === 1) {
      res.status(200).send({ message: 'Francesinha soft deleted successfully.' });
    } else {
      res.status(404).send({ message: 'Francesinha not found.' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Recover a soft deleted Francesinha by ID
router.put('/recover/:id', async (req, res) => {
  try {
    const francesinha = await Francesinha.update({ deleted: false }, { where: { id: req.params.id } });
    if (francesinha[0] === 1) {
      res.send({ message: 'Francesinha recovered successfully.' });
    } else {
      res.status(404).send({ message: 'Francesinha not found.' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all Francesinhas with optional sorting and filtering
router.get('/', async (req, res) => {
  const { q, sortBy = 'name', order = 'asc', includeDeleted = 'false', page = '1', limit = 'false' } = req.query;
  const allowedSortFields = ['name', 'price', 'rating'];
  const allowedOrders = ['asc', 'desc'];

  if (!allowedSortFields.includes(sortBy) || !allowedOrders.includes(order)) {
    return res.status(400).send({ message: 'Invalid sort field or order' });
  }

  try {
    const whereClause = { deleted: includeDeleted === 'true' ? true : false }
    if (q) {
      whereClause.name = { [Op.like]: `%${q}%` };
    }
    if (page == 0) return res.status(400).send({ message: 'Invalid page number' });

    if (limit == 'false') {
      Francesinha.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order.toUpperCase()]],
        include: [
          { model: Ingredient, as: 'Ingredients' },
          { model: Restaurant, as: 'Restaurants' }
        ],
        limit: 50,
      }).then((francesinhas) => {
          res.send(francesinhas);
        });
    } else {
      const count = await Francesinha.count({
        where: whereClause
      });
      Francesinha.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order.toUpperCase()]],
        include: [
          { model: Ingredient, as: 'Ingredients' },
          { model: Restaurant, as: 'Restaurants' }
        ],
        limit: Number(limit),
        offset: (page - 1) * limit,
      }).then((francesinhas) => {
          francesinhas.page = Number(page);
          francesinhas.maxPage = Math.ceil(count / limit);
          res.send(francesinhas);
        });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
