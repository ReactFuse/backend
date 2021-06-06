const Robot = require("../model/Robot");
const User = require("../model/User");

const express = require("express");
const router = express.Router();

const addRobot = async (req, res, next) => {
  console.log(req.body);
  const { active, managerId, description, managerName } = req.body;

  let robot;

  const createdRobot = new Robot({
    active,
    managerId,
    description,
    managerName,
  });

  try {
    await createdRobot.save();
  } catch (err) {
    console.log(err, "Created Robot");
    res.json({
      success: false,
      message: "Signing up failed, please try again later.",
    });
    return;
  }

  res.json({ success: true, message: "Robot added" });
};

const getRobots = async (req, res) => {
  let robots;
  try {
    robots = await Robot.find({}, "-password");
  } catch (err) {
    console.log(err, "Fetching Robots");
    res.json({
      success: false,
      message: "Fetching robots failed, please try again later.",
    });
    return;
  }

  res.json({ robots: robots });
};

const getRobot = async (req, res) => {
  let robot;
  try {
    robot = await Robot.find({ _id: req.body.id }, "-password");
  } catch (err) {
    console.log(err, "Fetching Robot");
    res.json({
      success: false,
      message: "Fetching Robots failed, please try again later.",
    });
    return;
  }
  res.json({ robot: robot });
};

const cancelRobot = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    Robot.updateMany(
      { _id: { $in: req.body } },
      { $set: { active: false, updatedAt: new Date().toISOString() } },
      function (err) {
        if (!err) {
          console.log("Robot updated");
          return res.json({ success: true, message: "Robot Updated" });
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

const editRobot = async (req, res) => {
  console.log(req.body);
  const { id, description, managerId, active, managerName } = req.body;
  await Robot.update(
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
        console.log("Robot Updated");
        return res.json({ success: true, message: "Robot Updated" });
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
  addRobot,
  getRobots,
  cancelRobot,
  getRobot,
  editRobot,
};
