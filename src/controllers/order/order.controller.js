const statusCode = require("../../config/statuscode");
const { responseData } = require("../../helpers/response");
const Service = require("../../services");

exports.addOrder = async (req, res) => {
  try {
    const result = await Service.OrderService.addOrder(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: "Error in creating user",
      });
    return responseData({ res, ...result });
  } catch (error) {
    responseData({
      res,
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: error.message,
    });
  }
};
