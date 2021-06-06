const express = require("express");
const robotsController = require("../controllers/robots-controllers.js");
const router = express.Router();

router.get("/", robotsController.getRobots);
router.post("/getrobot", robotsController.getRobot);
router.post("/add", robotsController.addRobot);
router.post("/cancel", robotsController.cancelRobot);
router.post("/update", robotsController.editRobot);

module.exports = router;
