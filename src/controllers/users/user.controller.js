const statusCode = require("../../config/statuscode");
const { responseData } = require("../../helpers/response");
const Service = require("../../services");

exports.register = async (req, res) => {
  try {
    console.log("Hello");
    const result = await Service.UserService.register(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: "Error in creating user",
      });
    responseData({ res, ...result });
  } catch (error) {
    responseData({
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
        message: "Error in logging",
      });
    responseData({ res, ...result });
  } catch (error) {
    responseData({
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
			message: "Error in Changing Password",
		  });
		responseData({ res, ...result });
	  } catch (error) {
		responseData({
		  res,
		  statusCode: statusCode.SERVER_ERROR,
		  success: 0,
		  message: error.message,
		});
	  }

};
