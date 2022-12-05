const User = require("../../models/user");
const Notification = require("../../models/notification");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { responseMessage } = require("../../helpers/response");
const statusCode = require("../../config/statuscode");

exports.register = async (req) => {
  let { phoneNo, password, name, address } = req.body;
  if (!phoneNo || !password || !name || !address)
    return {
      statusCode: statusCode.BADREQUEST,
      success: 0,
      message: responseMessage.INVALID_INPUT,
    };
  // User Exist or not
  // const checkUser = await User.findOne({ phoneNo: req.body.phoneNo });
  // if (checkUser)
  //   return {
  //     statusCode: statusCode.SERVER_ERROR,
  //     success: 0,
  //     message: responseMessage.USER_EXIST,
  //   };
  // console.log(checkUser, "checkUsercheckUser");

  let hash = await bcrypt.hash(req.body.password, 10);
  if (!hash) {
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.REGISTER_ERROR,
    };
  } else {
    const user = new User({
      name,
      password: hash,
      phoneNo,
      address,
      isAdmin: req.body?.isAdmin ? req.body.isAdmin : false,
    });
    let result = await user.save();
    if (!result)
      return {
        statusCode: statusCode.SERVER_ERROR,
        success: 0,
        message: responseMessage.REGISTER_ERROR,
      };

    let token = this.generateToken({
      id: result._id,
    });
    let notification = new Notification({
      userId: result._id,
      fcmToken: "Token",
    });
    await notification.save();

    let data = {
      id: result._id,
      name: result.name,
      address: result.address,
      phoneNo: result.phoneNo,
      isAdmin: result.isAdmin,
      token,
    };
    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.REGISTER_SUCCESS,
      data,
    };
  }
};

exports.changePassword = async (req) => {
  let { password, newPassword } = req.body;
  if (!password || !newPassword)
    return {
      statusCode: statusCode.BADREQUEST,
      success: 0,
      message: responseMessage.INVALID_INPUT,
    };

  const existingUser = await User.findOne({ phoneNo: req.user.phoneNo });

  const passwordCheck = await bcrypt.compare(
    req.body.password,
    existingUser.password
  );
  if (!passwordCheck) {
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.PASSWORD_NOT_MATCH,
    };
  } else {
    let hash = await bcrypt.hash(req.body.newPassword, 10);
    const result = await User.findByIdAndUpdate(existingUser._id, {
      $set: { password: hash },
    });
    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.PASSWORD_CHANGE_SUCCESS,
    };
  }
};

exports.login = async (req) => {
  const result = await User.findOne({ phoneNo: req.body.phoneNo });
  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.NO_USER,
    };

  const passwordCheck = await bcrypt.compare(
    req.body.password,
    result.password
  );
  if (!passwordCheck) {
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: responseMessage.PASSWORD_NOT_MATCH,
    };
  } else {
    let token = this.generateToken(result);

    let notification = new Notification({
      userId: result._id,
      fcmToken: "Token",
    });
    await notification.save();


    let data = {
      name: result.name,
      address: result.address,
      phoneNo: result.phoneNo,
      token,
    };
    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: responseMessage.LOGIN_SUCCESS,
      data,
    };
  }
};

exports.generateToken = (user) => {
  const secret = process.env.SECRET || "jack";
  const token = jsonwebtoken.sign(
    {
      id: user.id,
    },
    secret,
    {
      expiresIn: "24h",
    }
  );
  return token;
};
