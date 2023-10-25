const { User, validateUser } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
// User signup
exports.signupUser = async (req, res) => {
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;

    // Save the user to the database
    await user.save();

    // Create token
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(token);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send({ user });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
      return res.status(404).send("The user with the given id is not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
