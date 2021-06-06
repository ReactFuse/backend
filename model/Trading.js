const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const tradingSchema = new Schema({
  accountNum: { type: Number, required: true },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  robotId: {
    type: Schema.Types.ObjectId,
    ref: "Robot",
  },

  planId: {
    type: Schema.Types.ObjectId,
    ref: "Plan",
  },
  active: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  canceledTime: {
    type: Date,
  },
  startTime: {
    type: Date,
  },

  description: { type: String, required: true },
  managerName: { type: String, required: true },
  reactivate: { type: Boolean },
});

tradingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Trading", tradingSchema);
