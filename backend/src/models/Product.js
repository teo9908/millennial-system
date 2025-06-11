const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  _id: { type: String },  // Esto forzaría el _id a ser un String
  nombre: String,
  descripcion: String,
  precio: Number,
  categoria_codigo: String,
  imagenes: [String],
  stock: Number,
  activo: Boolean
}, { collection: 'products' });

module.exports = mongoose.model('Product', ProductSchema);
