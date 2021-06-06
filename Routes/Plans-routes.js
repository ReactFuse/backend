const express = require("express");
const plansController = require("../controllers/plans-controllers.js");
const router = express.Router();

router.get("/", plansController.getPlans);
router.post("/getplan", plansController.getPlan);
router.post("/add", plansController.addPlan);
router.post("/cancel", plansController.cancelPlan);
router.post("/update", plansController.editPlan);

module.exports = router;
