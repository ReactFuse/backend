const Trading = require("../model/Trading");
const User = require("../model/User");

const express = require("express");
const router = express.Router();

const addTrading = async (req, res, next) => {
  console.log(req.body);
  const {
    active,
    managerId,
    description,
    managerName,
    planId,
    robotId,
    accountNum,
    startTime,
  } = req.body;

  let trading;

  const createdTrading = new Trading({
    accountNum,
    managerId,
    description,
    managerName,
    planId,
    robotId,
    startTime,
  });

  try {
    await createdTrading.save();
  } catch (err) {
    console.log(err, "Created Trading");
    res.json({
      success: false,
      message: "Failed creating Trading",
    });
    return;
  }

  res.json({ success: true, message: "Trading added" });
};

const getTradings = async (req, res) => {
  let tradings;
  try {
    tradings = await Trading.find({}, "-password");
  } catch (err) {
    console.log(err, "Fetching tradings");
    res.json({
      success: false,
      message: "Fetching tradings failed, please try again later.",
    });
    return;
  }

  res.json({ tradings: tradings });
};

const getTrading = async (req, res) => {
  let trading;
  try {
    trading = await Trading.find({ _id: req.body.id }, "-password");
  } catch (err) {
    console.log(err, "Fetching TRadings");
    res.json({
      success: false,
      message: "Fetching TRadingss failed, please try again later.",
    });
    return;
  }
  res.json({ trading: trading });
};

const cancelTrading = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    Trading.updateMany(
      { _id: { $in: req.body } },
      {
        $set: {
          active: false,
          updatedAt: new Date().toISOString(),
          canceledTime: new Date().toISOString(),
          reactivate: false,
        },
      },
      function (err) {
        if (!err) {
          console.log("Trading updated");
          return res.json({
            success: true,
            message: "Trading License Updated",
          });
        } else {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const editTrading = async (req, res) => {
  console.log(req.body);
  const {
    id,
    description,
    managerId,
    active,
    managerName,
    robotId,
    planId,
    accountNum,
    startTime,
  } = req.body;
  await Trading.update(
    { _id: id },
    {
      $set: {
        description: description,
        managerId: managerId,
        active: active,
        managerName: managerName,
        updatedAt: new Date().toISOString(),
        robotId: robotId,
        planId: planId,
        accountNum,
        active: active,
        startTime,
      },
    },
    function (err) {
      if (!err) {
        console.log("Trading Updated");
        return res.json({ success: true, message: "Trading Updated" });
      } else {
        res.json({
          success: false,
          message: "Something went wrong",
        });
        return;
      }
    }
  );
};

module.exports = router;

module.exports = {
  addTrading,
  getTradings,
  cancelTrading,
  getTrading,
  editTrading,
};
