const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
});

const Category = mongoose.model("Category", categorySchema);

const validateCategory = (categoryData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "any.required": "Name is required",
      "string.min": "Name must be at least {#limit} characters long",
      "string.max": "Name cannot exceed {#limit} characters",
    }),
  });

  return schema.validate(categoryData, { abortEarly: false });
};

module.exports = {
  Category,
  validateCategory,
};
