const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    fcmToken: String,
  },
  { versionKey: false, timestamps: true }
);
module.exports = mongoose.model("notification", notificationSchema);
