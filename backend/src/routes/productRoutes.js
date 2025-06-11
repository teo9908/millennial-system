const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyAdmin = require("../middlewares/verifyAdmin");

// Acceso público
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protegidas solo para admin
router.post("/", verifyAdmin, productController.createProduct);
router.put("/:id", verifyAdmin, productController.updateProduct);
router.delete("/:id", verifyAdmin, productController.deleteProduct);

module.exports = router;
