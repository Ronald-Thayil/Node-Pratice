const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  phoneNo: Number,
  address: { type: String, required: true },
  isAdmin: Boolean
},{versionKey: false });

module.exports = mongoose.model("user", userSchema);
