const statusCode = require("../../config/statuscode");
const { responseData, responseMessage } = require("../../helpers/response");
const Service = require("../../services");

exports.register = async (req, res) => {
  try {
    const result = await Service.UserService.register(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: responseMessage.REGISTER_ERROR,
      });
    return responseData({ res, ...result });
  } catch (error) {
    return responseData({
      res,
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await Service.UserService.login(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: responseMessage.LOGIN_ERROR,
      });
   return responseData({ res, ...result });
  } catch (error) {
    return responseData({
      res,
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const result = await Service.UserService.changePassword(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: responseMessage.ERROR_CHANGEPASSWORD,
      });
      return responseData({ res, ...result });
  } catch (error) {
    return responseData({
      res,
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: error.message,
    });
  }
};
