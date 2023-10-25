const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    maxlength: 255,
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

const validateProduct = (productData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "any.required": "Name is required",
      "string.min": "Name must be at least {#limit} characters long",
      "string.max": "Name cannot exceed {#limit} characters",
    }),
    price: Joi.number().min(0).required().messages({
      "any.required": "Price is required",
      "number.min": "Price must be a positive number",
    }),
    description: Joi.string().max(255).allow("").optional(),
    category: Joi.string().required().messages({
      "any.required": "Category is required",
    }),
  });

  return schema.validate(productData, { abortEarly: false });
};

module.exports = {
  Product,
  validateProduct,
};
