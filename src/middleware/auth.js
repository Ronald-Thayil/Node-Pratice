const jsonwebtoken = require("jsonwebtoken");
const UserData = require("../models/user");
const statusCode = require("../config/statusCode");
const { responseData, responseMessage } = require("../helpers/response");

function verifyToken(req, res, next) {
  const secret = process.env.SECRET || "jack";
  let token = req.headers["x-access-token"] || req.headers.authorization;
  console.log(token, "123");
  debugger;
  if (token) {
    token = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
  } else {
    return responseData({
      res,
      statusCode: statusCode.UNAUTHORIZED,
      success: 0,
      message: responseMessage.SESSION_EXPIRED,
    });
  }
  jsonwebtoken.verify(token, secret, async (err, decoded) => {
    if (!decoded || err) {
      return responseData({
        res,
        statusCode: statusCode.UNAUTHORIZED,
        success: 0,
        message: responseMessage.SESSION_EXPIRED,
      });
    }

    const users = await UserData.findOne({ _id: decoded.id });

    if (!users)
      return responseData({
        res,
        statusCode: statusCode.UNAUTHORIZED,
        success: 0,
        message: responseMessage.NO_USER,
      });
    debugger
    console.log(users,'users');
    delete users.password;
    req.user = users;
    next();
  });
}

module.exports = verifyToken;
