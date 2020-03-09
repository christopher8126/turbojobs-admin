const mongoose = require("mongoose");
const { model } = require("./UserModel");
const Schema = mongoose.Schema;
const UserModel = require("./UserModel");

const userSubDocSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  }
});

const serviceSchema = new Schema({
  serviceTitle: {
    type: String,
    required: true
  },
  serviceDesc: {
    type: String,
    required: true
  },
  serviceCateg: {
    type: String,
    required: true
  },
  servicePrice: {
    type: String,
    required: true
  },
  serviceLocation: {
    type: String,
    required: true
  },
  owner: userSubDocSchema,
  isOccupied: {
    type: Boolean,
    default: false
  },
  datePosted: {
    type: Date,
    default: Date.now
  }
});

module.exports = ServiceModel = mongoose.model("service", serviceSchema);
