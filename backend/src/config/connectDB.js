const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Conectar a MongoDB Atlas
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "MillennialSystemCatalog" // ✅ Asegura que apunta a la base correcta
        });

        console.log(`✅ Conectado a MongoDB Atlas en: ${conn.connection.host}`);
        console.log(`🗄️ Base de datos en uso: ${conn.connection.db.databaseName}`);

        // Validar si las colecciones existen
        const collections = await conn.connection.db.listCollections().toArray();
        console.log("📂 Colecciones disponibles:", collections.map(c => c.name));

    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error);
        process.exit(1); // Finaliza el proceso si hay error en la conexión
    }
};

// ✅ Exportar para ser usado en server.js
module.exports = connectDB;
