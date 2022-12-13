const Order = require("../../models/order");
const Notification = require("../../models/notification");
const statusCode = require("../../config/statuscode");
const sendNotification = require("../../helpers/notification");
const { responseMessage } = require("../../helpers/response");
function sortData(orderData) {
  let newarray = orderData.map((item) => {
    let data = {
      orderId: item.orderId,
      orderStatus: item.orderStatus,
      medImage: item.medImage,
      medicines: item.medicines,
      createdAt: item.createdAt,
    };
    return data;
  });
  return newarray;
}

exports.addOrder = async (req) => {
  let prevData = await Order.find().sort({ _id: -1 }).limit(1);
  let orderId = prevData[0]?.orderId ? prevData[0]?.orderId + 1 : 1001;

  let { orderStatus, medicines } = req.body;

  if (!orderStatus || !(req?.files?.images || medicines))
    return {
      statusCode: statusCode.BADREQUEST,
      success: 0,
      message: responseMessage.INVALID_INPUT,
    };

  let medImage = [];

  let data = {
    userId: req.user._id,
    orderStatus: orderStatus,
    orderId,
  };
  data.medicines = medicines ? JSON.parse(medicines) : [];
  if (req?.files?.images) {
    let filetype = ["image/png", "image/jpeg"];
    const { images } = req?.files;
    if (images.length) {
      for (let index = 0; index < images.length; index++) {
        if (!filetype.includes(images[index].mimetype)) {
          return {
            statusCode: statusCode.SERVER_ERROR,
            success: 0,
            message: responseMessage.INVALID_FILE_TYPE,
          };
        }

        let filename = `${orderId}-` + Date.now() + images[index].name;
        debugger;
        images[index].mv(process.env.filePath + filename);
        debugger;
        medImage.push(filename);
      }
    } else {
      if (!filetype.includes(images.mimetype)) {
        return {
          statusCode: statusCode.SERVER_ERROR,
          success: 0,
          message: responseMessage.INVALID_FILE_TYPE,
        };
      }

      let filename = `${orderId}-` + Date.now() + images.name;
      images.mv(process.env.filePath + images.name);

      medImage.push(filename);
    }

    data.medImage = medImage;
  }

  const order = new Order(data);
  let result = await order.save();

  // Notification Data
  // let notification = {
  //   data,
  //   notification: {
  //     title: "Navish",
  //     body: "Test message by navish",
  //   },
  // };
  // // let deviceToken = await Notification.find({ userId: result.userId });
  // // let token = deviceToken.map((data) => data.fcmToken);
  // // console.log(token);

  // sendNotification.sendPushNotification({
  //   notification,
  //   token,
  //   isAdmin: false,
  // });

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

  if (isAdmin) {
    const result = await Order.find();
    console.log(result, "result");

    if (!result)
      return {
        statusCode: statusCode.SERVER_ERROR,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
      };
    let orderData = await sortData(result);
    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.ORDER_PLACED,
      data: orderData,
    };
  } else {
    const result = await Order.find({ userId: _id });
    console.log(result, "result");

    if (!result)
      return {
        statusCode: statusCode.SERVER_ERROR,
        success: 0,
        message: responseMessage.ORDER_FAILURE,
      };

    let orderData = await sortData(result);
    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.ORDER_PLACED,
      data: orderData,
    };
  }
};

exports.getOrderDetail = async (req) => {
  let { orderId } = req.body;

  const result = await Order.find({ orderId });
  debugger;
  if (!result || !result.length)
    return {
      statusCode: statusCode.NOTFOUND,
      success: 0,
      message: responseMessage.ORDER_NOT_FOUND,
    };

  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: responseMessage.ORDER_DETAIL,
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
