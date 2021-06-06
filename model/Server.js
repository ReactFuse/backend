const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const serverSchema = new Schema({
  userName: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  serverIp: { type: String, required: true },
  comment: { type: String, required: true },
  subscriptionType: { type: String, required: true },
  active: { type: Boolean, default: true },

  emailAlertOnError: { type: Boolean, required: true },
  emailOnError: { type: Array },
  smsAlertOnError: { type: Boolean, required: true },
  mobileOnError: { type: Array },
  isErrorReported: { type: Boolean },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  canceledTime: { type: String },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  autoRenew: { type: String, required: true },
  lastPingTime: { type: String, required: true },
});

serverSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Server", serverSchema);
