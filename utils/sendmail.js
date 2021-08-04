const mongoose = require("mongoose");
const Websites = require("../models/websites");
const AppError = require("./AppError");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLOUD_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLOUD_SECRET;
const REDIRECT_URI = process.env.GOOGLE_CLOUD_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_CLOUD_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (req, res, next) => {
  try {
    let { website } = req.body;
    let site = await Websites.findById(website);
    // console.log(site);
    const { cs } = req.body;
    // console.log(cs);
    const accessToken = await oAuth2Client.getAccessToken();
    // console.log(accessToken);

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_ACCOUNT,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: "Client Support App <developer.neatfx@gmail.com>",
      to: "aftocr@gmail.com",
      subject: `${cs.name} has found an issue on ${site.name} or requesting something.`,
      text: `Request/Issue: ${cs.issue}`,
      html: `<h2>Name:${cs.name}</h2> <h3>Request/Issue: ${cs.issue}</h3><p> Requested for: ${site.name}</p> Image for Reference: <img src="${req.upload}" alt="">`,
    };
    const result = await transport.sendMail(mailOptions);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = sendMail;
