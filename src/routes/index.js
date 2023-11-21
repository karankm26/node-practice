const express = require("express");
const {
  createUser,
  updateUser,
  getUsers,
  getUserById,
} = require("../controllers/user.controller");
const authenticateToken = require("../middleware/auth.middleware");
const { login } = require("../controllers/login.controller");

const router = express.Router();

router.post("/user", createUser);
router.put("/user/:id", authenticateToken, updateUser);
router.get("/users", getUsers);
router.get("/user/:id", getUserById);
router.post("/login", login);

module.exports = router;
