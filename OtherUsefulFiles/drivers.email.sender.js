const nodemailer = require("nodemailer");
const moment = require("moment");
const cron = require("node-cron");
const bcrypt = require('bcrypt')
const { generatePwdForUser } = require("./generate.activation.code");
const user = require("../Models/user");
const { where } = require("sequelize");


const sendDriverEmail = async (find_user) => {

  const localAppInstructions = ` Congratulations!! ${find_user.name} ${find_user.surname} your document was verified with success you are now a member of eTravel. hurry up and login now so you don't miss the suprise
`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "apitimetable@gmail.com",
      pass: "pkzvdgmaqjtwkuam",
    },
  });

  const mailOptions = {
    from: "apitimetable@gmail.com",
    to: find_user.email,
    subject: "eTravel",
    text: ` ${localAppInstructions} `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(`Error while sending email to ${find_user.email}:`, error);
    } else {
      console.log(`Email sent successfully to ${find_user.email}.`);
    }
  });

};

module.exports = sendDriverEmail;
