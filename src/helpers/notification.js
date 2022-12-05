var admin = require("firebase-admin");
var fcm = require("fcm-notification");
var serviceAccount = require("../config/secret.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);
const { responseMessage } = require("../helpers/response");
const statusCode = require("../config/statuscode");

exports.sendPushNotification = (notificationData) => {
  try {
    let { fcm_token, title, body, data } = notificationData;

    let message = {
      data,
      notification: {
        title,
        body,
      },
    };
    if (fcm_token.length > 1) {
      FCM.sendToMultipleToken(message, fcm_token, function (err, resp) {
        if (err) {
          return {
            statusCode: statusCode.SERVER_ERROR,
            success: 0,
            message: responseMessage.NOTIFICATION_ERROR,
          };
        } else {
          return {
            statusCode: statusCode.SUCCESS,
            success: 1,
            message: responseMessage.NOTIFICATION_SUCCESS,
          };
        }
      });
    } else {
      message.token = fcm_token;
      FCM.send(message, function (err) {
        if (err) {
          return {
            statusCode: statusCode.SERVER_ERROR,
            success: 0,
            message: responseMessage.NOTIFICATION_ERROR,
          };
        } else {
          return {
            statusCode: statusCode.SUCCESS,
            success: 1,
            message: responseMessage.NOTIFICATION_SUCCESS,
          };
        }
      });
    }
  } catch (err) {
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: err.message,
    };
  }
};
