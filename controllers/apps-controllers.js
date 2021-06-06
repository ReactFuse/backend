const App = require("../model/App");
const User = require("../model/User");

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const addApps = async (req, res, next) => {
  console.log(req.body);
  let {
    appName,
    userId,
    userName,
    privateKey,
    emailAlertOnError,
    emailOnError,
    smsAlertOnError,
    mobileOnError,
    isErrorReported,
    lastPingTime,
  } = req.body;

  emailOnError = emailOnError.split(",");
  mobileOnError = mobileOnError.split(",");
  // console.log(emailOnError);
  let apps;

  const createdApps = new App({
    appName,
    userId,
    userName,
    privateKey,
    emailAlertOnError,
    emailOnError,
    smsAlertOnError,
    mobileOnError,
    isErrorReported,
    lastPingTime,
  });

  try {
    await createdApps.save();
  } catch (err) {
    console.log(err, "Created Apps");
    res.json({
      success: false,
      message: "Failed creating Apps",
    });
    return;
  }

  res.json({ success: true, message: "Apps added" });
};

const getApps = async (req, res) => {
  let apps;
  try {
    apps = await App.find({}, "-password");
  } catch (err) {
    console.log(err, "Fetching apps");
    res.json({
      success: false,
      message: "Fetching apps failed, please try again later.",
    });
    return;
  }

  //   let todayDate = new Date().toISOString();

  //   let updatedapps = apps.map((server) => {
  //     if (todayDate > server.endTime) {
  //       server = {
  //         ...server._doc,
  //         active: false,
  //         reactivate: false,
  //         updatedAt: new Date().toISOString(),
  //         canceledTime: todayDate,
  //       };
  //       // console.log(server, "in if state");
  //       return server;
  //     } else {
  //       // console.log("in else State");
  //       return server;
  //     }
  //   });

  res.json({ apps: apps });
};

const getApp = async (req, res) => {
  let app;
  try {
    app = await App.find({ _id: req.body.id }, "-password");
  } catch (err) {
    console.log(err, "Fetching apps");
    res.json({
      success: false,
      message: "Fetching appss failed, please try again later.",
    });
    return;
  }
  res.json({ app: app });
};

const removeApps = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    App.remove({ _id: req.body }, function (err) {
      if (!err) {
        console.log("App updated");
        return res.json({
          success: true,
          message: "App  Updated",
        });
      } else {
        console.log(err);
        res.json({
          success: false,
          message: "Something went wrong",
        });
        return;
      }
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }
};

const editApps = async (req, res) => {
  console.log(req.body);
  let {
    id,
    appName,
    userId,
    userName,
    privateKey,
    emailAlertOnError,
    emailOnError,
    smsAlertOnError,
    mobileOnError,
    isErrorReported,
    lastPingTime,
  } = req.body;

  emailOnError = emailOnError.split(",");
  mobileOnError = mobileOnError.split(",");
  await App.update(
    { _id: id },
    {
      $set: {
        updatedAt: new Date().toISOString(),
        appName,
        userId,
        userName,
        privateKey,
        emailAlertOnError,
        emailOnError,
        smsAlertOnError,
        mobileOnError,
        isErrorReported,
        lastPingTime,
      },
    },
    function (err) {
      if (!err) {
        console.log("App Updated");
        return res.json({ success: true, message: "App Updated" });
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

const getTestEmails = async (req, res) => {
  console.log(req.body);
  const { id } = req.body;
  let testEmails;
  try {
    testEmails = await App.findOne({ _id: id });
    console.log(testEmails);
  } catch (err) {
    console.log(err);
    res.json({ succcess: false, message: "Failed getting emails" });
    return;
  }
  res.json({
    succcess: true,
    message: "Emails found",
    testEmails: testEmails.emailOnError,
  });
};

const sendEmailOne = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  if (email) {
    const output = `
            <p>Test Email</p>
            
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
      from: '"Test Email" <queryaidataron@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Test Email", // Subject line
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

        // let emailOtp = new Emailotp({
        //   email,
        //   otp,
        // });
        // await emailOtp.save();
        res.json({ success: true, message: "Email Sent" });
        // return true;
      }
    });
    return true;
  } else {
    res.json({ success: true, message: "Something went Wrong" });
    return false;
  }
};

const sendEmailAll = async (req, res) => {
  console.log(req.body);
  const { emails } = req.body;

  if (emails) {
    const output = `
            <p>Test Email</p>
            
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
      from: '"Test Email" <queryaidataron@gmail.com>', // sender address
      to: emails, // list of receivers
      subject: "Test Email", // Subject line
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

        // let emailOtp = new Emailotp({
        //   email,
        //   otp,
        // });
        // await emailOtp.save();
        res.json({ success: true, message: "Email Sent" });
        // return true;
      }
    });
    return true;
  } else {
    res.json({ success: true, message: "Something went Wrong" });
    return false;
  }
};

module.exports = router;

module.exports = {
  addApps,
  getApps,
  removeApps,
  getApp,
  editApps,
  getTestEmails,
  sendEmailOne,
  sendEmailAll,
};
