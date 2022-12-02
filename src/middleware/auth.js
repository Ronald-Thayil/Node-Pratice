const jsonwebtoken = require("jsonwebtoken");
const UserData = require("../models/user");
const statusCode = require("../config/statusCode");
const { responseData } = require("../helpers/response");

function verifyToken(req, res, next) {
  const secret = "jack";
  let token = req.headers["x-access-token"] || req.headers.authorization;
  console.log(token, "123");

  if (token) {
    token = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
  } else {
    return responseData({
      res,
      statusCode: statusCode.UNAUTHORIZED,
      success: 0,
      message: "Your session has expired",
    });
  }
  jsonwebtoken.verify(token, secret, async (err, decoded) => {
    if (!decoded || err) {
      return responseData({
        res,
        statusCode: statusCode.UNAUTHORIZED,
        success: 0,
        message: "Your session has expired",
      });
    }

    const users = await UserData.findOne({ id: decoded.id });

    if (!users)
      return responseData({
        res,
        statusCode: statusCode.UNAUTHORIZED,
        success: 0,
        message: "Your session has expired",
      });
    delete users.password;
    req.user = users;
    next();
  });
}

module.exports = verifyToken;
