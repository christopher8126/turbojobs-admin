const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ServiceModel = require("./ServiceModel");

const userSchema = new Schema({
  userType: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  workingOn: {
    type: Schema.Types.ObjectId,
    ref: "service"
  }
});

module.exports = WorkerUserModel = mongoose.model("users.worker", userSchema);
