const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const appSchema = new Schema({
  appName: { type: String, required: true },
  userName: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  privateKey: { type: String, required: true },
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
  lastPingTime: { type: String, required: true },
});

appSchema.plugin(uniqueValidator);

module.exports = mongoose.model("App", appSchema);
