const nodemailer = require("nodemailer");
const moment = require("moment");
const cron = require("node-cron");
const bcrypt = require('bcrypt')
const { generatePwdForUser } = require("./generate.activation.code");
const user = require("../Models/user");
const { where } = require("sequelize");


const sendEmails = async (user_id, email, name, surname) => {
  const Password = generatePwdForUser();
  await user
    .update({ userCode: bcrypt.hashSync(Password, 10) }, { where: { id: user_id.id } })
   console.log( await user
    .update({ userCode: bcrypt.hashSync(Password, 10) }, { where: { id: user_id.id } })
  ,"user code");
  const localAppInstructions = `
  use this link to activate your account: http://192.168.0.146:3000
    ${Password} is your activation code
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
    to: email,
    subject: "eTravel",
    text: `Hi ${name} ${surname} welcome to eTravel ${localAppInstructions} `,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(`Error while sending email to ${email}:`, error);
    } else {
      console.log(`Email sent successfully to ${email}.`);
    }
  });
  return Password;
};

module.exports = sendEmails;
