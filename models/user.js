const mongoose = require("mongoose");
const Joi = require("joi");
const JWT = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});
userSchema.methods.generateAuthToken = function () {
  const token = JWT.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtprivatekey"),
    {
      expiresIn: "1h",
    }
  );
  return token;
};
const User = mongoose.model("User", userSchema);

const validateUser = (userData) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "any.required": "Name is required",
      "string.min": "Name must be at least {#limit} characters long",
      "string.max": "Name cannot exceed {#limit} characters",
    }),
    email: Joi.string().email().min(5).max(255).required().messages({
      "any.required": "Email is required",
      "string.email": "Invalid email format",
      "string.min": "Email must be at least {#limit} characters long",
      "string.max": "Email cannot exceed {#limit} characters",
    }),
    password: Joi.string().min(8).max(1024).required().messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least {8} characters long",
      "string.max": "Password cannot exceed {#limit} characters",
    }),
  });

  return schema.validate(userData, { abortEarly: false });
};

module.exports = {
  User,
  validateUser,
};
