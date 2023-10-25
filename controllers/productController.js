const { Product, validateProduct } = require("../models/product");
const _ = require("lodash");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "-_id");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const product = new Product(
      _.pick(req.body, ["name", "price", "description", "category"])
    );
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, price, description, category } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        category,
      },
      { new: true }
    ).populate("category");
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
