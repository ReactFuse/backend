const Plan = require("../model/Plan");
const User = require("../model/User");

const express = require("express");
const router = express.Router();

const addPlan = async (req, res, next) => {
  console.log(req.body);
  const { active, managerId, description, managerName } = req.body;

  let plan;

  const createdPlan = new Plan({
    active,
    managerId,
    description,
    managerName,
  });

  try {
    await createdPlan.save();
  } catch (err) {
    console.log(err, "Created Plan");
    res.json({
      success: false,
      message: "Signing up failed, please try again later.",
    });
    return;
  }

  res.json({ success: true, message: "Plan added" });
};

const getPlans = async (req, res) => {
  let plans;
  try {
    plans = await Plan.find({}, "-password");
  } catch (err) {
    console.log(err, "Fetching plans");
    res.json({
      success: false,
      message: "Fetching plans failed, please try again later.",
    });
    return;
  }

  res.json({ plans: plans });
};

const getPlan = async (req, res) => {
  let plan;
  try {
    plan = await Plan.find({ _id: req.body.id }, "-password");
  } catch (err) {
    console.log(err, "Fetching Plans");
    res.json({
      success: false,
      message: "Fetching Planss failed, please try again later.",
    });
    return;
  }
  res.json({ plan: plan });
};

const cancelPlan = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    Plan.updateMany(
      { _id: { $in: req.body } },
      { $set: { active: false, updatedAt: new Date().toISOString() } },
      function (err) {
        if (!err) {
          console.log("Plan updated");
          return res.json({ success: true, message: "Plan Updated" });
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

const editPlan = async (req, res) => {
  console.log(req.body);
  const { id, description, managerId, active, managerName } = req.body;
  await Plan.update(
    { _id: id },
    {
      $set: {
        description: description,
        managerId: managerId,
        active: active,
        managerName: managerName,
        updatedAt: new Date().toISOString(),
      },
    },
    function (err) {
      if (!err) {
        console.log("Plan Updated");
        return res.json({ success: true, message: "Plan Updated" });
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
  addPlan,
  getPlans,
  cancelPlan,
  getPlan,
  editPlan,
};
