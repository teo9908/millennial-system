const express = require('express'); // Framework para manejar rutas y solicitudes HTTP
const router = express.Router(); // Enrutador modular
const productRoutes = require('./productRoutes'); // Importa rutas de productos

// Define el prefijo `/products` para las rutas de productos
router.use('/products', productRoutes);

// Exporta el enrutador para su uso en la aplicación
module.exports = router;
