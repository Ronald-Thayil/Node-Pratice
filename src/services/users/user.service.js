const mongoose = require("mongoose");
const User = require("../../models/user");
const Notification = require("../../models/notification");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { responseData } = require("../../helpers/response");
const statusCode = require("../../config/statuscode");

exports.register = async (req) => {
  // User Exist or not
  // const checkUser = await User.findOne({ phoneNo: req.body.phoneNo });
  // if (checkUser)
  //   return {
  //     statusCode: statusCode.SERVER_ERROR,
  //     success: 0,
  //     message: "User Already Exist",
  //   };
  // console.log(checkUser, "checkUsercheckUser");
  let hash = await bcrypt.hash(req.body.password, 10);
  if (!hash) {
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 0,
      message: "Error in user registration",
      error: err,
    };
  } else {
    const user = new User({
      name: req.body.name,
      password: hash,
      phoneNo: req.body.phoneNo,
      address: req.body.address,
      isAdmin: req.body.isAdmin,
    });
    let result = await user.save();
    if (!result)
      return {
        statusCode: statusCode.SERVER_ERROR,
        success: 0,
        message: err.errors.email.message,
      };

    let gentoken = {
      id: result._id,
    };

    let token = this.generateToken(gentoken);
    let notification = new Notification({
      userId: result.id,
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
      message: "User registered successfully",
      data,
    };
  }
};

exports.changePassword = async (req) => {
  const existingUser = await User.findOne({ phoneNo: req.user.phoneNo });
  if (!existingUser)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 1,
      message: "No User Found",
    };

  const passwordCheck = await bcrypt.compare(
    req.body.password,
    existingUser.password
  );
  if (!passwordCheck) {
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 1,
      message: "Password Not Matched",
    };
  } else {
    let hash = await bcrypt.hash(req.body.newPassword, 10);
    const result = await User.findByIdAndUpdate(existingUser._id, {
      $set: { password: hash },
    });
    return {
      statusCode: statusCode.SUCCESS,
      success: 1,
      message: "Password Change Successfully",
    };
  }
};

exports.login = async (req) => {
  const result = await User.findOne({ phoneNo: req.body.phoneNo });
  if (!result)
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 1,
      message: "No User Found",
    };

  // console.log(req.password, result.password,'pass');
  const passwordCheck = await bcrypt.compare(
    req.body.password,
    result.password
  );
  if (!passwordCheck) {
    return {
      statusCode: statusCode.SERVER_ERROR,
      success: 1,
      message: "Password Not Matched",
    };
  } else {
    let token = this.generateToken(result);

    let notification = new Notification({
      userId: result.id,
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
      message: "User login",
      data,
    };
  }
};

exports.generateToken = (user) => {
  const secret = process.env.SECRET || "jack";
  const token = jsonwebtoken.sign(
    {
      id: user._id,
      name: user.name,
      address: user.address,
      phoneNo: user.phoneNo,
    },
    secret,
    {
      expiresIn: "24h",
    }
  );
  return token;
};
