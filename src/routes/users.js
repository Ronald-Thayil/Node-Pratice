const express = require("express");
const router = express.Router();
const Controller = require("../controllers");
const verifyToken = require("../middleware/auth");

router.post("/register", Controller.UserController.register);
router.post("/login", Controller.UserController.login);
router.post(
  "/changepassword",
  verifyToken,
  Controller.UserController.changePassword
);


module.exports = router;
