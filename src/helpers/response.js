exports.responseData = ({ res, statusCode,success,message, data, error }) => {
	const resultObj = {
		success:success,
		message:message,
		data: data,
		error: error
	};
	return res.status(statusCode).send(resultObj);
};

exports.responseMessage ={
	REGISTER_ERROR :"Error in Registeration",
	INVALID_INPUT : "Invalid request",
	USER_EXIST:"User Already Exist",
	REGISTER_SUCCESS : "User registered successfully",
	LOGIN_SUCCESS: "User login successfully",
	LOGOUT_SUCCESS: "User logout successfully",
	PASSWORD_NOT_MATCH : "Password Not Matched",
	PASSWORD_CHANGE_SUCCESS : "Password Change Successfully",
	UPDATE_PROFILE:"Profile Updated Successfully",
	NO_USER :"No User Found",
	NO_FCM_TOKEN:"No fcm token found",
	INVALID_FILE_TYPE:"File Type Didn't match",
	ORDER_PLACED:"Order Placed successfully",
	UPDATE_ORDER:"Order Updated successfully",
	ORDER_DETAIL:"Order Detail",
	ORDER_FAILURE : "Error in creating order",
	ORDER_NOT_FOUND:"Order Not Found",
	LOGIN_ERROR : "Error in logging",
	LOGOUT_ERROR : "Error in logout",
	ERROR_CHANGEPASSWORD : "Error in Changing Password",
	NOTIFICATION_ERROR:"Error in Sending Notification",
	NOTIFICATION_SUCCESS : "Notification Send Successfully",
	SESSION_EXPIRED : "Your session has expired",
	SOMETHING_WRONG : "Something went wrong"
}