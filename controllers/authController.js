const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const authenticateUser = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid email or password");
    }
    const token = user.generateAuthToken();
    res.send(token);
  } catch (error) {
    res.status(500).send({ error: "Failed to authenticate user" });
  }
};

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

module.exports = {
  authenticateUser,
};
