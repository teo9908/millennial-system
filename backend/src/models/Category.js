// backend/src/models/Category.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoria_codigo: { type: String },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  imagenes: { type: [String], default: [] }
});

// El tercer parámetro 'categories' asegura que el modelo se vincule a la colección "categories" en tu base de datos.
module.exports = mongoose.model('Category', categorySchema, 'categories');
