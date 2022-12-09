const express = require('express');
const router = express.Router();
const controller = require('../controllers')
const verifyToken = require("../middleware/auth");

router.post('/addOrder',verifyToken,controller.OrderController.addOrder)
router.get('/getOrderData',verifyToken,controller.OrderController.getOrderData)
router.post('/getOrderDetail',verifyToken,controller.OrderController.getOrderDetail)
router.post('/orderUpdate',verifyToken,controller.OrderController.orderUpdate)

module.exports = router;

