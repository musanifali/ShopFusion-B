const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
router.get("/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password");
    res.send({ user });
  } catch (e) {
    console.log("error: ", e);
    return;
  }
});
router.delete("/:id", [auth, admin], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("The user with given id is not found");

  res.send(user);
});
router.post("/signup", async (req, res) => {
  try {
    // Validate request body
    const { error } = validateUser(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).send({ error: errorMessage });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({ error: "User already exists." });
    }
    // Create a user
    user = new User(_.pick(req.body, ["name", "email", "password"]));
    // Hash the password
    const salted = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salted);
    user.password = hashed;
    // Save the user to the database
    await user.save();
    // create token
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(token);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = router;
