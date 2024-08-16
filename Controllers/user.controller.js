const { empty } = require("php-in-js/modules/types");
const Role = require("../Models/role");
const user = require("../Models/user");
const validator = require("validator");
const User = require("../Models/user");
const sendEmails = require("../OtherUsefulFiles/email.sender");
const uploadDocument = require("../OtherUsefulFiles/upload.document");
const ProfileUpload = require("../OtherUsefulFiles/profile.upload");

const { generateTokenForUSer } = require("../OtherUsefulFiles/token");
const bcrypt = require("bcrypt");
const {
  sendDriverRequestNotification,
} = require("../OtherUsefulFiles/firebase.admin.not");
const { Op, where } = require("sequelize");
const sendDriverEmail = require("../OtherUsefulFiles/drivers.email.sender");

//user functions
//create user
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      surname,
      role,
      email,
      password,
      city,
      phone,
      CNI,
      agencycompanyLogo,
      drivingLicense,
      vehiclePhoto,
      profileImage,
      agencyOwner,
      agencyBusStation,
      agencyBusinessRegistrationCertificate,
      agencyTaxIdentificationNumber,
      agencyProofOfAddress,
      agencyBusinessLicense,
      agencyRegNumber,
    } = req.body;
    const cameroonCode = "237";

    if (
      empty(name) ||
      empty(surname) ||
      empty(password) ||
      empty(city) ||
      empty(phone) ||
      empty(email) ||
      empty(role)
    ) {
      console.log(name, role, surname, password, phone, email, city);
      return res
        .status(400)
        .json({ msg: "please enter all required fields correctly" });
    }
    const phonewithcode = cameroonCode + phone;
    console.log(phonewithcode, "phoneback");
    if (name.length < 2 || surname.length < 2) {
      return res.status(400).json({ msg: "invalid name length" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "password must be atleast 8-characters long" });
    }

    if (!validator.isEmail(email)) {
      console.log(email);
      return res.status(400).json({ msg: "enter a valid email" });
    }
    const role_exist = await Role.findOne({ where: { id: role } });
    if (!role_exist) {
      return res.status(400).json({ msg: "role does not exist" });
    }
    const user_exist = await user.findOne({
      where: {
        email,
      },
    });
    console.log(user_exist, "user_exist");
    if (user_exist) {
      return res.status(409).json({ msg: "you already exist" });
    }
    const find_role_client = await Role.findOne({ where: { name: "client" } });
    const new_user = {
      name,
      surname,
      email,
      city,
      password: bcrypt.hashSync(password, 10),
      role,
      phone,
    };

    if (find_role_client.id === parseInt(role)) {
      const new_user_id = await user.create(new_user);
      await user.update(
        { accountStatus: true },
        { where: { id: new_user_id.id } }
      );

      sendEmails(new_user_id, email, name, surname);
      return res.status(201).json({
        msg: "Congratulations! you created your account successfully.",
      });
    } else if (
      (await Role.findOne({ where: { name: "driver" } })).id === parseInt(role)
    ) {
      if (
        empty(CNI) ||
        empty(vehiclePhoto) ||
        empty(drivingLicense) ||
        empty(profileImage)
      ) {
        return res.status(400).json({ msg: "upload all require document" });
      }
      const new_driver = await user.create(new_user);
      await user.update(
        { accountStatus: true },
        { where: { id: new_driver.id } }
      );

      console.log(new_driver.accountStatus, "new-driver");

      uploadDocument(
        new_driver.id,
        CNI,
        drivingLicense,
        vehiclePhoto,
        profileImage
      );
      if (uploadDocument) {
        sendEmails(new_driver, email, name, surname);

        return res.status(200).json({
          success:
            "A code has been send to your email to activate your account",
        });
      }
      return res.status(400).json({ msg: "fail to update" });
    } else if (
      (await Role.findOne({ where: { name: "agency" } })).id === parseInt(role)
    ) {
      if (
        empty(agencyBusStation) ||
        empty(agencyRegNumber) ||
        empty(agencyOwner)
      ) {
        return res.status(400).json({ msg: "Fill required fields" });
      }
      if (
        empty(CNI) ||
        empty(agencyBusinessRegistrationCertificate) ||
        empty(agencyProofOfAddress) ||
        empty(agencyTaxIdentificationNumber) ||
        empty(agencycompanyLogo) ||
        empty(agencyBusinessLicense)
      ) {
        return res.status(400).json({ msg: "upload all require document" });
      }
      const new_agency = {
        agencyBusStation,
        agencyRegNumber,
        agencyOwner,
        city,
        password: bcrypt.hashSync(password, 10),
        role,
        phone,
      };
      const new_agence = await user.create(new_user);
      await user.update(
        { accountStatus: true },
        { where: { id: new_agence.id } }
      );

      console.log(new_agency.accountStatus, "new_agency");

      uploadDocument(
        new_agency.id,
        CNI,
        agencyBusinessRegistrationCertificate,
        agencyProofOfAddress,
        agencyTaxIdentificationNumber,
        agencyBusinessLicense,
        agencycompanyLogo
      );
      if (uploadDocument) {
        sendEmails(new_agency, email, name, surname);

        return res.status(200).json({
          success:
            "A code has been send to your email to activate your account",
        });
      }
      return res.status(400).json({ msg: "fail to update" });
    }
    {
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

//delete user by id
exports.deleteUserById = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const user_exist = await User.destroy({ where: { id: user_id } });
    if (!user_exist) {
      return res.status(200).json({ success: "user not found" });
    }
    return res.status(200).json({ success: `user deleted successfully` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

//verify code
exports.verifyCode = async (req, res) => {
  try {
    const { email, code_send } = req.body;

    if (empty(email)) {
      return res.status(400).json({ MessageChannel: "email is required" });
    }
    const find_user = await user.findOne({ where: { email } });

    if (!find_user) {
      return res.status(404).json({ msg: "user not found" });
    }
    if (empty(code_send)) {
      console.log(code_send, "code_send");
      return res.status(400).json({ msg: "enter the code send to your email" });
    }
    console.log(code_send, "hey", find_user, find_user.id);

    const compare_code = bcrypt.compareSync(code_send, find_user.userCode);

    if (compare_code) {
      const password_updated = await user.update(
        { passwordStatus: true },
        { where: { email } }
      );

      const eligible_user = await user.findOne({
        where: { [Op.and]: [{ email }, { accountStatus: true }] },
      });

      if (password_updated && eligible_user) {
        await user.update({ accountActive: true }, { where: { email } });
        const token = generateTokenForUSer(find_user.id, find_user.role);
        console.log(token, "active account");
        return res
          .status(200)
          .json({ token, msg: "Account activated successfully" });
      } else {
        return res
          .status(404)
          .json({ msg: "An Error occured while activating account" });
      }
    } else {
      return res.status(400).json({ msg: "invalid code" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal server error" });
  }
};

//user login
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (empty(email) || empty(password)) {
    return res
      .status(400)
      .json({ msg: " enter all required fields correctly" });
  }
  const user_exist = await user.findOne({ where: { email } });
  if (!user_exist) {
    return res.status(404).json({ msg: "user not found" });
  } else {
    if (
      user_exist.passwordStatus === true &&
      bcrypt.compareSync(password, user_exist.password)
    ) {
      const token = generateTokenForUSer(user_exist.id, user_exist.role);
      console.log(token, "token");
      return res.status(200).json({ token, msg: "login successful" });
    }
    return res.status(400).json({
      msg: "invalid password, make sure you activate your account",
    });
  }
};

//Admin Functions
//get pending users with role driver

//verify and activate user account with role driver
exports.verifyDocuments = async (req, res) => {
  const driver_id = req.params.driver_id;
  const find_user = await user.findOne({ where: { id: driver_id } });
  if (find_user) {
    const update_docstatus = await user.update(
      { documentStatus: true },
      { where: { id: driver_id } }
    );
    if (update_docstatus) {
      await user.update({ accountStatus: true }, { where: { id: driver_id } });
      sendDriverEmail(find_user);
      return res
        .status(200)
        .json({ msg: "accountStatus updated successfully" });
    }
    return res.status(400).json({ msg: "fail to update document status" });
  }
};

exports.editProfile = async (req, res) => {
  const userObj = req.user;
  const { profileImage, email, phone, password } = req.body;

  if (empty(password)) {
    return res.status(400).json({ msg: " your password is required " });
  } else {
    const verify_password = await user.findOne({
      where: { password: bcrypt.compare(password, userObj.password) },
    });
    if (verify_password) {
      if (empty(profileImage) && empty(email) && empty(phone)) {
        return res
          .status(400)
          .json({ msg: "You are required to fill at least a field." });
      }

      if (!empty(phone) || !empty(email)) {
        const existingUser = await user.constructor.findOne({
          where: {
            [Op.or]: [{ phone }, { email }],
            id: { [Op.ne]: userObj.id },
          },
        });

        if (existingUser) {
          return res
            .status(400)
            .json({ msg: "Phone or email already exists." });
        }
      }

      const fieldsToUpdate = {};

      if (!empty(profileImage)) ProfileUpload(profileImage);
      if (!empty(email)) fieldsToUpdate.email = email;
      if (!empty(phone)) fieldsToUpdate.phone = phone;

      await user.update(fieldsToUpdate, { where: { id: user.id } });

      return res.status(200).json({ msg: "Update successful." });
    }
    return res.status(404).json({ msg: "Incorrect Password" });
  }
};

//driver view all upload documents

exports.viewUploadedDocuments = async (req, res) => {
  const userObj = req.user;

  const user_docs = await user.findOne(
    { where: { id: userObj.id } },
    { attributes: { drivingLicense, CNI } }
  );
  const user_vehicle_docs = await user.findOne(
    { where: { id: userObj.js } },
    {
      attributes: {
        vehicleRegistrationCertificate,
        vehicleSalesCertificate,
        vehicleRoadWorthinessReport,
        vehicleRegistrationCertificate,
      },
    }
  );
  return res.status(200).json({ msg: user_docs, user_vehicle_docs });
};
