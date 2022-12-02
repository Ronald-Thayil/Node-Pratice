const express = require('express');
const router = express.Router();
const controller = require('../controllers')
const verifyToken = require("../middleware/auth");

router.post('/addOrder',verifyToken,controller.OrderController.addOrder)

module.exports = router;

