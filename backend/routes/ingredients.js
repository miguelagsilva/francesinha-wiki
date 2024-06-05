const express = require('express');
const router = express.Router();
const { Ingredient, Francesinha } = require('../models');
const { Op } = require('sequelize');

// Create an Ingredient
router.post('/', async (req, res) => {
  const { name, deleted, francesinhas } = req.body;

  try {
    const ingredient = await Ingredient.create({ name, deleted });

    if (francesinhas && francesinhas.length > 0) {
      const francesinhaInstances = await Francesinha.findAll({
        where: {
          id: francesinhas
        }
      });
      await ingredient.addFrancesinhas(francesinhaInstances);
    }

    const ingredientWithFrancesinhas = await Ingredient.findByPk(ingredient.id, {
      include: [{ model: Francesinha, as: 'Francesinhas' }]
    });

    res.status(201).send(ingredientWithFrancesinhas);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update an Ingredient by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, deleted, francesinhas } = req.body;

  try {
    const ingredient = await Ingredient.findByPk(id);

    if (!ingredient) {
      return res.status(404).send({ message: 'Ingredient not found' });
    }

    ingredient.name = name || ingredient.name;
    ingredient.deleted = deleted !== undefined ? deleted : ingredient.deleted;

    await ingredient.save();

    if (francesinhas && francesinhas.length > 0) {
      const francesinhaInstances = await Francesinha.findAll({
        where: {
          id: francesinhas
        }
      });
      await ingredient.setFrancesinhas(francesinhaInstances);
    }

    res.send(ingredient);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete an Ingredient by ID
router.delete('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.update({ deleted: true }, { where: { id: req.params.id } });
    if (ingredient[0] === 1) {
      res.status(200).send({ message: 'Ingredient soft deleted successfully.' });
    } else {
      res.status(404).send({ message: 'Ingredient not found.' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Recover a soft deleted Ingredient by ID
router.put('/recover/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.update({ deleted: false }, { where: { id: req.params.id } });
    if (ingredient[0] === 1) {
      res.send({ message: 'Ingredient recovered successfully.' });
    } else {
      res.status(404).send({ message: 'Ingredient not found.' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all Ingredients with optional sorting and filtering
router.get('/', async (req, res) => {
  const { q, sortBy = 'name', order = 'asc', includeDeleted = 'false', page = '1', limit = 'false' } = req.query;
  const allowedSortFields = ['name'];
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
      Ingredient.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order.toUpperCase()]],
        include: [
          { model: Francesinha, as: 'Francesinhas' }
        ],
        limit: 50,
      }).then((ingredients) => {
          res.send(ingredients);
        });
    } else {
      const count = await Ingredient.count({
        where: whereClause
      });
      Ingredient.findAndCountAll({
        where: whereClause,
        order: [[sortBy, order.toUpperCase()]],
        include: [
          { model: Francesinha, as: 'Francesinhas' }
        ],
        limit: Number(limit),
        offset: (page - 1) * limit,
      }).then((ingredients) => {
          ingredients.page = Number(page);
          ingredients.maxPage = Math.ceil(count / limit);
          res.send(ingredients);
        });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
