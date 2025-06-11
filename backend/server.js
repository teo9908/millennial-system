// Carga las variables de entorno antes de cualquier otra cosa
require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

// Importación de rutas
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const userRoutes = require('./src/routes/userRoutes'); // ✅ ¡Esta ruta es clave!

const app = express();
const PORT = process.env.PORT || 5000;

// Conexión a MongoDB Atlas usando MONGO_URI de .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(error => console.error('❌ Error al conectar a MongoDB:', error));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para la API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', userRoutes);


// Servir archivos estáticos: se sirve todo el contenido de "frontend/public"
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Redirige la raíz a la página de inicio
app.get("/", (req, res) => {
  res.redirect("/views/home.html");
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Para debug opcional (puedes borrar luego si todo está bien)
console.log("Mongo URI:", process.env.MONGO_URI);
