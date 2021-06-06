const express = require("express");
const middleware = require("../middleware/check-auth");

const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersController.getUsers);
router.post("/getuser", usersController.getUser);
router.post("/deleteuser", usersController.deleteUser);
router.post("/edituser", usersController.editUser);

router.post(
  "/register",

  check("displayName").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),

  usersController.signup
);

router.post("/login", usersController.login);

router.post("/access-token", usersController.getToken);
router.post("/updateprofile", usersController.updateProfile);

router.get("/getmanagers", usersController.getManagers);

module.exports = router;
