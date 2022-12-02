const mongoose = require("mongoose");
const Order = require("../../models/order");
const statusCode = require("../../config/statuscode");
const notification = require("../../helpers/notification")
require("dotenv").config();
exports.addOrder = async (req) => {
  let prevData = await Order.find().sort({ _id: -1 }).limit(1);
  let orderId = prevData[0]?.orderId ? prevData[0]?.orderId + 1 : 1001;

  let medImage = [];
  let data = {
    userId: req.user.id,
    orderStatus: req.body.orderStatus,
    orderId,
  };
  if (req?.files?.image) {
    const { image } = req.files;
    let filetype = ["image/png", "image/jpeg"];

    if (image.length) {
      for (let index = 0; index < image.length; i++) {
        if (!filetype.includes(image[index].mimetype)) {
          return {
            statusCode: statusCode.SERVER_ERROR,
            success: 0,
            message: "File Type Didn't match",
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
          message: "File Type Didn't match",
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

  let notification = {
    data,
    notification: {
      title:"Navish" ,
      body: "Test message by navish",
    },
  }
  let token =['qweqweqweewq']

  notification.sendPushNotification({notification,token,isAdmin})

  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: err.errors.email.message,
    };

  return {
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: "Order Placed successfully",
    data: result,
  };
};
