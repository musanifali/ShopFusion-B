// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// CRUD routes for products
router.get("/products", productController.getAllProducts);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
