const express = require("express");
const appsController = require("../controllers/apps-controllers.js");
const router = express.Router();

router.get("/", appsController.getApps);
router.post("/getapp", appsController.getApp);
router.post("/add", appsController.addApps);
router.post("/remove", appsController.removeApps);
router.post("/update", appsController.editApps);
router.post("/gettestemails", appsController.getTestEmails);
router.post("/sendemailone", appsController.sendEmailOne);
router.post("/sendemailall", appsController.sendEmailAll);

router.post("/ping", appsController.ping);

module.exports = router;
