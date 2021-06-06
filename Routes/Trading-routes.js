const express = require("express");
const tradingController = require("../controllers/trading-controllers.js");
const router = express.Router();

router.get("/", tradingController.getTradings);
router.post("/gettrading", tradingController.getTrading);
router.post("/add", tradingController.addTrading);
router.post("/cancel", tradingController.cancelTrading);
router.post("/update", tradingController.editTrading);

module.exports = router;
