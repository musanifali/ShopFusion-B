const { Category, validateCategory } = require("../models/category");
const _ = require("lodash");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const category = new Category({
      name: req.body.name,
    });
    const savedCategory = await category.save();
    res.status(201).send(savedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }
    console.log(category);
    res.send(category);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch category" });
  }
};

// Update a category by ID
const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true }
    );
    console.log(updatedCategory);

    res.send(updatedCategory);
  } catch (error) {
    res.status(500).send({ error: "Failed to update category" });
  }
};

// Delete a category by ID
const deleteCategoryById = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndRemove(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.send(deletedCategory);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
