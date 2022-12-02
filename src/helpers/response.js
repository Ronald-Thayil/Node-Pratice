exports.responseData = ({ res, statusCode,success,message, data, error }) => {
	const resultObj = {
		success:success,
		message:message,
		data: data,
		error: error
	};
	return res.status(statusCode).send(resultObj);
};
