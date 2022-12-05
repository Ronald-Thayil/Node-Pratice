const statusCode = require("../../config/statuscode");
const { responseData, responseMessage } = require("../../helpers/response");
const Service = require("../../services");

exports.addOrder = async (req, res) => {
  try {
    const result = await Service.OrderService.addOrder(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
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

exports.getOrderData = async (req, res) => {
  try {
    const result = await Service.OrderService.getOrderData(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
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

exports.getOrderDetail = async (req, res) => {
  try {
    const result = await Service.OrderService.getOrderDetail(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
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

exports.orderUpdate = async (req, res) => {
  try {
    const result = await Service.OrderService.orderUpdate(req);
    if (!result)
      return responseData({
        res,
        statusCode: statusCode.BADREQUEST,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
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
