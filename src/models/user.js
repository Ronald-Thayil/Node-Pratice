const mongoose = require("mongoose");
const { validator } = require("paperwork");
const userSchema = new mongoose.Schema(
  {
    name: String,
    password: {
      type: String,
      required: [true, "Password is a required field"],
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    address: { type: String, required: true },
    isAdmin: Boolean,
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
