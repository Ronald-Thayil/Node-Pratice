const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    orderId: Number,
    orderStatus: String,
    medImage: { type: Array, default: [] },
    medicines: { type: Array, default: [] },
  },
  { versionKey: false, timestamps: true }
);
module.exports = mongoose.model("order", orderSchema);
