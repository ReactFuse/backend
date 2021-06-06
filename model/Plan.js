const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const planSchema = new Schema({
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  active: { type: Boolean, required: true, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },

  description: { type: String, required: true },
  managerName: { type: String, required: true },
});

planSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Plan", planSchema);
