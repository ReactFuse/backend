const express = require("express");
const serversController = require("../controllers/servers-controllers.js");
const router = express.Router();

router.get("/", serversController.getServers);
router.post("/getserver", serversController.getServer);
router.post("/add", serversController.addServers);
router.post("/cancel", serversController.cancelServers);
router.post("/update", serversController.editServers);
router.post("/gettestemails", serversController.getTestEmails);
router.post("/sendemailone", serversController.sendEmailOne);
router.post("/sendemailall", serversController.sendEmailAll);

module.exports = router;
