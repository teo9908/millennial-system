const Product = require('../models/Product');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Controlador para obtener todos los productos, con filtro opcional
const getAllProducts = async (req, res) => {
  try {
    let query = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query = { 
        $or: [
          { nombre: regex },
          { descripcion: regex },
          { categoria_codigo: regex }
        ]
      };
    }
    const products = await Product.find(query);
    // Agregamos logging para ver los IDs disponibles
    console.log("IDs de productos en GET all:", products.map(p => p._id.toString()));
    if (!products.length) {
      return res.status(404).json({ message: "No se encontraron productos" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error en el servidor al obtener productos", error });
  }
};

// Controlador para obtener un producto por su ID (usando findOne)
const getProductById = async (req, res) => {
  try {
    let id = req.params.id.trim();
    console.log("Buscando producto con id recibido:", id);
    
    const product = await Product.findOne({ _id: id }).lean();
    console.log("Resultado de findOne:", product);
    
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error en getProductById:", error);
    return res.status(500).json({ message: "Error en el servidor al obtener el producto", error });
  }
};



// Controlador para crear un producto
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ message: "Error en el servidor al crear producto", error });
  }
};

// Controlador para actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ message: "Error en el servidor al actualizar producto", error });
  }
};

// Controlador para eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json({ message: "✅ Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ message: "Error en el servidor al eliminar producto", error });
  }
};

module.exports = { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};
