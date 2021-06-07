const validationResult = require("express-validator").validationResult;
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const HttpError = require("../model/http-error");
const User = require("../model/User");
const nodemailer = require("nodemailer");
var otpGenerator = require("otp-generator");

const express = require("express");
const router = express.Router();

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    // const error = new HttpError(
    //   "Fetching users failed, please try again later.",
    //   500
    // );
    // return next(error);
    console.log(err, "Fetching USers");
    res.json({
      success: false,
      message: "Fetching users failed, please try again later.",
    });
    return;
  }
  res.json({ users: users });
};

const getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.find({ _id: req.body.id }, "-password");
  } catch (err) {
    // const error = new HttpError(
    //   "Fetching users failed, please try again later.",
    //   500
    // );
    // return next(error);
    console.log(err, "Fetching USer");
    res.json({
      success: false,
      message: "Fetching users failed, please try again later.",
    });
    return;
  }
  res.json({ user: user });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { displayName, email, password, role, privateKey } = req.body;

  console.log(displayName, email, password, role, privateKey);

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    // const error = new HttpError(
    //   "Signing up failed, please try again later.",
    //   500
    // );
    // return next(error);
    console.log(err, "existing user first");
    res.json({
      success: false,
      message: "Signing up failed, please try again later.",
    });
    return;
  }

  if (existingUser) {
    // const error = new HttpError(
    //   "User exists already, please login instead.",
    //   422
    // );
    // return next(error);
    console.log(err, "Existing USER");
    res.json({
      success: false,
      message: "User exists already, please login instead.",
    });
    return;
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    // const error = new HttpError(
    //   "Could not create user, please try again.",
    //   500
    // );
    // return next(error);
    console.log(err, "HASHED password");
    res.json({
      success: false,
      message: "Could not create user, please try again.",
    });
    return;
  }

  const createdUser = new User({
    displayName,
    email,
    password: hashedPassword,
    role,
    privateKey: privateKey,
    permissions: role,
  });

  try {
    await createdUser.save();
  } catch (err) {
    // const error = new HttpError(
    //   "Signing up failed, please try again later.",
    //   500
    // );
    // return next(error);
    console.log(err, "Created USer");
    res.json({
      success: false,
      message: "Signing up failed, please try again later.",
    });
    return;
  }

  let access_token;

  try {
    access_token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "jwt_access_token",
      { expiresIn: "1h" }
    );
  } catch (err) {
    // const error = new HttpError(
    //   "Signing up failed, please try again later.",
    //   500
    // );
    // return next(error);
    console.log(err, "JWT TOKEN");
    res.json({
      success: false,
      message: "Signing up failed, please try again later.",
    });
    return;
  }
  console.log("before response");
  res.status(201).json({
    message: "user created",
    role: [createdUser.role],
    displayName: createdUser.displayName,
    userId: createdUser.id,
    email: createdUser.email,
    password: createdUser.password,
    access_token: access_token,
    success: true,
  });
  console.log("user  singin wala   ");
};

const login = async (req, res, next) => {
  const { email, password, rememberMe, ip } = req.body;
  console.log(email, password, rememberMe, ip);

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
    console.log(existingUser);
  } catch (err) {
    // const error = new HttpError(
    //   "Logging in failed, please try again later.",
    //   500
    // );
    // return next(error);
    res.json({
      success: false,
      message: "Logging in failed, please try again later",
    });
    return;
  }

  console.log(existingUser);

  if (!existingUser) {
    // const error = new HttpError(
    //   "Invalid credentials, could not log you in.",
    //   403
    // );
    // return next(error);
    res.json({ success: false, message: "Invalid Credentials" });
    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    // const error = new HttpError(
    //   "Could not log you in, please check your credentials and try again.",
    //   500
    // );
    // return next(error);
    res.json({ success: false, message: "Invalid Credentials" });
    return;
  }

  if (!isValidPassword) {
    // const error = new HttpError(
    //   "Invalid credentials, could not log you in.",
    //   403
    // );
    // return next(error);
    res.json({ success: false, message: "Invalid Credentials" });
    return;
  }

  let access_token;
  try {
    access_token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "jwt_access_token",
      rememberMe ? null : { expiresIn: "1h" }
    );
  } catch (err) {
    // const error = new HttpError(
    //   "Logging in failed, please try again later.",
    //   500
    // );
    // return next(error);
    res.json({ success: false, message: "Login Failed" });
    return;
  }

  console.log;

  res.json({
    message: "you are login success fully ",
    displayName: existingUser.displayName,
    userId: existingUser.id,
    role: existingUser.role,
    email: existingUser.email,
    password: existingUser.password,
    access_token: access_token,
    success: true,
  });

  User.update(
    { _id: existingUser._id },
    { $set: { lastLoginIp: ip, lastLogin: new Date().toISOString() } },
    function (err) {
      if (!err) {
        console.log("User  Updated");
        return;
      } else {
        console.log("error");
        return;
      }
    }
  );
};
// accessing token API
const getToken = async (req, res, next) => {
  console.log("body", req.body);
  const access_token = req.body.access_token;
  console.log("token:", access_token);
  console.log("body:", req.body);
  let user;
  try {
    console.log("token checking");
    const decodedToken = jwt.verify(access_token, "jwt_access_token");
    console.log("decoded token ", decodedToken);
    //user = { userId: decodedToken.userId };
    user = await User.findById({ _id: decodedToken.userId });
    console.log("user id hy", user);
  } catch (err) {
    const error = new HttpError("No token found or token is expired.", 500);
    return next(error);
  }
  res.json({ user: user, access_token: access_token });
};

// Bring in Models & Helpers

// fetch all users api

router.get("/", (req, res) => {
  const user = req.user._id;

  User.findById(user, { password: 0, _id: 0 }, (err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }

    res.status(200).json({
      user,
    });
  });
});

router.put("/", (req, res) => {
  const user = req.user._id;
  const update = req.body.profile;
  const query = { _id: user };

  User.findOneAndUpdate(
    query,
    update,
    {
      new: true,
    },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Your profile is successfully updated!",
        user,
      });
    }
  );
});

const updateProfile = async (req, res) => {
  console.log(req.body);

  const { displayName, newPassword, userId } = req.body;

  if (newPassword) {
    console.log("IN IF STATEMENT");
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
      const error = new HttpError(
        "Could not create user, please try again.",
        500
      );
      return next(error);
    }

    User.update(
      { _id: userId },
      { $set: { displayName: displayName, password: hashedPassword } },
      function (err) {
        if (!err) {
          console.log("Username Updated");
          return res.json({ success: true, message: "Username Updated" });
        } else {
          res.json({
            success: false,
            message: "Something went wrong",
          });
          return;
        }
      }
    );
  } else {
    console.log("IN ELSE STATEMENT");
    try {
      User.update(
        { _id: userId },
        { $set: { displayName: displayName } },
        function (err) {
          if (!err) {
            console.log("Username Updated");
            return res.json({ success: true, message: "Username Updated" });
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
  }
};

const deleteUser = async (req, res, next) => {
  console.log(req.body);

  const ids = req.body;

  try {
    let user = await User.deleteMany({ _id: ids });
    res.json({ success: true, message: "Users deleted" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Deleteing Failed" });
    return;
  }
};

const editUser = async (req, res, next) => {
  console.log(req.body);

  const { displayName, role, id, privateKey } = req.body;

  try {
    User.update(
      { _id: id },
      {
        $set: { displayName: displayName, role: role, privateKey: privateKey },
      },
      function (err) {
        if (!err) {
          console.log("User Updated");
          return res.json({ success: true, message: "Username Updated" });
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

const getManagers = async (req, res) => {
  let users;
  try {
    users = await User.find({ role: "manager" }, "-password");
  } catch (err) {
    console.log(err, "Fetching Managers");
    res.json({
      success: false,
      message: "Fetching Managers failed, please try again later.",
    });
    return;
  }
  res.json({ managers: users });
};

const sendOtp = async (req, res) => {
  console.log(req.body);

  let otp = otpGenerator.generate(4, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  const { email } = req.body;

  if (email && otp) {
    const output = `
            <p>Here is your Forgot Password OTP</p>
            <p>${otp}</p>
            `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.google.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      service: "gmail",
      auth: {
        user: "queryaidataron@gmail.com", // generated ethereal user
        pass: "nwnxovucjfoqqwww", // generated ethereal password
      },
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Expert Invest" ', // sender address
      to: email, // list of receivers
      subject: "Forgot Password OTP", // Subject line
      // text: details, // plain text body
      html: output, // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return error;
      } else {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        if (otp[0] === "0") {
          otp = `0${otp}`;
        }
        User.update(
          { email: email },
          { $set: { forgotPasswordOtp: otp } },
          function (err) {
            if (!err) {
              console.log("Otp Saved");
              // return res.json({ success: true, message: "Username Updated" });
            } else {
              res.json({
                success: false,
                message: "Something went wrong",
              });
              return;
            }
          }
        );
        res.json({ success: true, message: "OTP Email Sent" });
        // return true;
      }
    });
    return true;
  } else {
    res.json({ success: false, message: "Something went Wrong" });
    return false;
  }
};

const verifyOtp = async (req, res) => {
  console.log(req.body);
  const { otp, email } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
    if (user) {
      console.log(user);
      if (user.forgotPasswordOtp.toString() === otp) {
        res.json({ success: true, message: "OTP Verified" });
      } else {
        res.json({ success: false, message: "Wrong OTP" });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Something went Wrong" });
  }
};

const newPassword = async (req, res) => {
  console.log(req.body);

  const { newPassword, email } = req.body;
  console.log(newPassword, email);

  if (newPassword && email) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(newPassword, 12);
    } catch (err) {
      console.log("Error hashing password", err);

      res.json({
        success: false,
        data: err,
        message: "Something went wrong",
      });
      return;
    }

    console.log(hashedPassword);

    try {
      await User.update(
        { email: email },
        { $set: { password: hashedPassword } },
        function (err) {
          if (!err) {
            console.log("Updated");
            return res.json({ success: true, message: "Password Updated" });
          } else {
            console.log(err);
            res.json({
              success: false,
              data: err,
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
        data: err,
        message: "Something went wrong",
      });
    }
  } else {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = router;

module.exports = {
  getUsers,
  signup,
  login,
  getToken,
  updateProfile,
  deleteUser,
  getUser,
  editUser,
  getManagers,
  sendOtp,
  verifyOtp,
  newPassword,
};
