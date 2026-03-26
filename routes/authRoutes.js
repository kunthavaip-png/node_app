const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authorizeRoles = require("../middleware/authMiddleware");
const { addUser,updateUser,listUser } = require("../controllers/UserController");

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/adduser", authorizeRoles("admin"), addUser);
router.post("/updateUser/:id", authorizeRoles("admin"), updateUser);
router.post("/listUser", authorizeRoles("admin"), listUser);
module.exports = router;