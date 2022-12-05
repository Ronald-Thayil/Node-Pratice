const express = require("express");
const router = express.Router();
const users = require("./users");
const orders = require("./orders");
const statusCode = require("../config/statuscode");
const { responseData } = require("../helpers/response");
require('dotenv').config()
// const accountSid = "AC3c12a856a9c924397dca853a41c8531c";
// const authToken = "8da3f124efa583d143209f12c246813c";
// const client = require("twilio")(accountSid, authToken);

router.get("/check", (req, res) => {
  responseData({
    res,
    statusCode: statusCode.SUCCESS,
    success: 1,
    message: "API CALLING",
  })
  // res.send("API CALLING");
});
router.post("/upload", (req, res) => {
  // Get the file that was set to our field named "image"
  const { image } = req.files;

  // If no image submitted, exit
  if (!image) return res.sendStatus(400);

  // If does not have image mime type prevent from uploading
  //   if (/^image/.test(image.mimetype)) return res.sendStatus(400);

  // Move the uploaded image to our upload folder
  //   image.mv("C:/Users/Thayil's/Desktop/Metro-Node/src/upload/" + image.name);
  
  for (let i = 0; i < image.length; i++) {
    image[i].mv(
      process.env.filePath+ image[i].name
    );
  }
  // All good
  res.sendStatus(200);
});

// router.post("/send-message", async (req, res) => {
//   try {
//     const { number } = req.body;
// console.log(number,'123');
//     client.messages
//       .create({ body: "Hi there Roanld", from: "+19136755112", to: number })
//       .then((message) => {
//         console.log(message);
//         return res.status(200).json({
//           type: "success",
//           data: message.sid
//         })
//       }).catch(error => console.log('>>', error));

//   } catch (error) {
//     return res.status(500).json({
//       type: "error",
//       message: error.message || "Something went wrong.",
//     });
//   }
// });
router.use(users);
router.use(orders);

module.exports = router;
