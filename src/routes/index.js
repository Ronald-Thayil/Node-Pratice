const express = require("express");
const router = express.Router();
const users = require("./users");
const orders = require("./orders");
const statusCode = require("../config/statuscode");
const { responseData } = require("../helpers/response");

router.get("/check", (req, res) => {
  return responseData({
    res,
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: "API CALLING",
  });
  // res.send("API CALLING");
});

router.use(users);
router.use(orders);

module.exports = router;
