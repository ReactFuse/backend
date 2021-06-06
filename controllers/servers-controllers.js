const Server = require("../model/Server");
const User = require("../model/User");

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const addServers = async (req, res, next) => {
  console.log(req.body);
  let {
    userId,
    userName,
    serverIp,
    comment,
    subscriptionType,
    autoRenew,
    emailAlertOnError,
    emailOnError,
    smsAlertOnError,
    mobileOnError,
    isErrorReported,
    startTime,
    endTime,
    lastPingTime,
  } = req.body;

  emailOnError = emailOnError.split(",");
  mobileOnError = mobileOnError.split(",");
  // console.log(emailOnError);
  let servers;

  const createdServers = new Server({
    userId,
    userName,
    serverIp,
    comment,
    subscriptionType,
    autoRenew,
    emailAlertOnError,
    emailOnError,
    smsAlertOnError,
    mobileOnError,
    isErrorReported,
    startTime,
    endTime,
    lastPingTime,
  });

  try {
    await createdServers.save();
  } catch (err) {
    console.log(err, "Created Servers");
    res.json({
      success: false,
      message: "Failed creating Servers",
    });
    return;
  }

  res.json({ success: true, message: "Servers added" });
};

const getServers = async (req, res) => {
  let servers;
  try {
    servers = await Server.find({}, "-password");
  } catch (err) {
    console.log(err, "Fetching servers");
    res.json({
      success: false,
      message: "Fetching servers failed, please try again later.",
    });
    return;
  }

  let todayDate = new Date().toISOString();

  let updatedServers = servers.map((server) => {
    if (todayDate > server.endTime) {
      server = {
        ...server._doc,
        active: false,
        reactivate: false,
        updatedAt: new Date().toISOString(),
        canceledTime: todayDate,
      };
      // console.log(server, "in if state");
      return server;
    } else {
      // console.log("in else State");
      return server;
    }
  });

  res.json({ servers: updatedServers });
};

const getServer = async (req, res) => {
  let server;
  try {
    server = await Server.find({ _id: req.body.id }, "-password");
  } catch (err) {
    console.log(err, "Fetching Servers");
    res.json({
      success: false,
      message: "Fetching Serverss failed, please try again later.",
    });
    return;
  }
  res.json({ server: server });
};

const cancelServers = async (req, res) => {
  console.log(req.body);
  const { id, cancelTime } = req.body;

  try {
    Server.updateMany(
      { _id: { $in: id } },
      {
        $set: {
          active: false,
          updatedAt: new Date().toISOString(),
          canceledTime: cancelTime,
          reactivate: false,
        },
      },
      function (err) {
        if (!err) {
          console.log("Server updated");
          return res.json({
            success: true,
            message: "Server  Updated",
          });
        } else {
          console.log(err);
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

const editServers = async (req, res) => {
  console.log(req.body);
  let {
    id,
    userId,
    userName,
    serverIp,
    comment,
    subscriptionType,
    autoRenew,
    emailAlertOnError,
    emailOnError,
    smsAlertOnError,
    mobileOnError,
    isErrorReported,
    startTime,
    endTime,
    lastPingTime,
  } = req.body;

  emailOnError = emailOnError.split(",");
  mobileOnError = mobileOnError.split(",");
  await Server.update(
    { _id: id },
    {
      $set: {
        updatedAt: new Date().toISOString(),
        userId,
        userName,
        serverIp,
        comment,
        subscriptionType,
        autoRenew,
        emailAlertOnError,
        emailOnError,
        smsAlertOnError,
        mobileOnError,
        isErrorReported,
        startTime,
        endTime,
        lastPingTime,
      },
    },
    function (err) {
      if (!err) {
        console.log("Server Updated");
        return res.json({ success: true, message: "Server Updated" });
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
    testEmails = await Server.findOne({ _id: id });
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
  addServers,
  getServers,
  cancelServers,
  getServer,
  editServers,
  getTestEmails,
  sendEmailOne,
  sendEmailAll,
};
