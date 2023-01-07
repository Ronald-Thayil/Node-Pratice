const express = require("express");
const router = express.Router();
const Controller = require("../controllers");
const verifyToken = require("../middleware/auth");

router.post("/register", Controller.UserController.register);
router.post("/login", Controller.UserController.login);
router.post("/logout", Controller.UserController.logout);
router.post(
  "/updateprofile",
  verifyToken,
  Controller.UserController.updateprofile
);

router.post(
  "/changepassword",
  verifyToken,
  Controller.UserController.changePassword
);

module.exports = router;
