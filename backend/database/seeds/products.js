const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../../src/models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Conectado a MongoDB Atlas");
    console.log("La colección 'products' ya existe y se usarán sus datos. No se insertarán productos de ejemplo.");
    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Error en conexión:", err));
