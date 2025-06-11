// backend/src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Asegúrate de crear el modelo Category

// GET /api/categories - obtiene todas las categorías
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
});

module.exports = router;
