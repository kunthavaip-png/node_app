const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authorizeRoles = require("../middleware/authMiddleware");
const { addUser } = require("../controllers/UserController");

router.post("/login", authController.login);
router.post("/adduser", authorizeRoles("admin"), addUser);
module.exports = router;