const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send({
      error: error.details[0].message,
    });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  // compare password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  // create token
  const token = user.generateAuthToken();

  res.send(token);
});

const validate = (userData) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required().messages({
      "any.required": "Email is required",
      "string.email": "Invalid email format",
      "string.min": "Email must be at least {#limit} characters long",
      "string.max": "Email cannot exceed {#limit} characters",
    }),
    password: Joi.string().min(8).max(1024).required().messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least {#limit} characters long",
      "string.max": "Password cannot exceed {#limit} characters",
    }),
  });

  return schema.validate(userData, { abortEarly: false });
};
module.exports = router;
