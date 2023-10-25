const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/me", auth, userController.getUserProfile);
router.delete("/:id", [auth, admin], userController.deleteUser);
router.post("/signup", userController.signupUser);

module.exports = router;
