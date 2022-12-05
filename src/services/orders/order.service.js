const Order = require("../../models/order");
const Notification = require("../../models/notification");
const statusCode = require("../../config/statuscode");
const sendNotification = require("../../helpers/notification");
const { responseMessage } = require("../../helpers/response");
exports.addOrder = async (req) => {
  let prevData = await Order.find().sort({ _id: -1 }).limit(1);
  let orderId = prevData[0]?.orderId ? prevData[0]?.orderId + 1 : 1001;

  let { orderStatus, medecine } = req.body;

  if (!orderStatus || !(req?.files?.image || medecine))
    return {
      statusCode: statusCode.BADREQUEST,
      success: 0,
      message: responseMessage.INVALID_INPUT,
    };

  let medImage = [];
  debugger;
  let data = {
    userId: req.user._id,
    orderStatus: orderStatus,
    orderId,
    medecine,
  };
  if (req?.files?.image) {
    let filetype = ["image/png", "image/jpeg"];
    const { image } = req?.files;
    if (image.length) {
      for (let index = 0; index < image.length; index++) {
        if (!filetype.includes(image[index].mimetype)) {
          return {
            statusCode: statusCode.SERVER_ERROR,
            success: 0,
            message: responseMessage.INVALID_FILE_TYPE,
          };
        }

        let filename = `${orderId}-` + Date.now() + image[index].name;
        image[index].mv(process.env.filePath + filename);

        medImage.push(filename);
      }
    } else {
      if (!filetype.includes(image.mimetype)) {
        return {
          statusCode: statusCode.SERVER_ERROR,
          success: 0,
          message: responseMessage.INVALID_FILE_TYPE,
        };
      }

      let filename = `${orderId}-` + Date.now() + image.name;
      image.mv(process.env.filePath + image.name);

      medImage.push(filename);
    }

    data.medImage = medImage;
  }

  const order = new Order(data);
  let result = await order.save();

  // Notification Data
  let notification = {
    data,
    notification: {
      title: "Navish",
      body: "Test message by navish",
    },
  };
  let deviceToken = await Notification.find({ userId: result.userId });
  let token = deviceToken.map((data) => data.fcmToken);
  console.log(token);

  sendNotification.sendPushNotification({
    notification,
    token,
    isAdmin: false,
  });

  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.ORDER_FAILURE,
    };

  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: responseMessage.ORDER_PLACED,
    data: result,
  };
};

exports.getOrderData = async (req) => {
  let { isAdmin, _id } = req.user;
  debugger;
  if (isAdmin) {
    const result = await Order.find();
    console.log(result, "result");

    if (!result)
      return {
        statusCode: statusCode.SERVER_ERROR,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
      };

    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.ORDER_PLACED,
      data: result,
    };
  } else {
    const result = await Order.find({ userId:_id });
    console.log(result, "result");
    debugger;
    if (!result)
      return {
        statusCode: statusCode.SERVER_ERROR,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
      };

    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.ORDER_PLACED,
      data: result,
    };
  }
};

exports.getOrderDetail = async (req) => {
  let { orderId } = req.body;

  const result = await Order.find({ orderId });

  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.ORDER_FAILURE,
    };

  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: responseMessage.ORDER_PLACED,
    data: result,
  };
};

exports.orderUpdate = async (req) => {
  let { orderId, orderStatus } = req.body;

  const result = await Order.findOneAndUpdate({ orderId }, { orderStatus });

  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.ORDER_FAILURE,
    };

  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: responseMessage.ORDER_PLACED,
    data: result,
  };
};
