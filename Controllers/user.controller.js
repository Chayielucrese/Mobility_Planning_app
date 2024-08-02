const { empty } = require("php-in-js/modules/types");
const Role = require("../Models/role");
const user = require("../Models/user");
const validator = require("validator");
const { where } = require("sequelize");
const User = require("../Models/user");
const sendEmails = require("../OtherUsefulFiles/email.sender");
const { password } = require("../OtherUsefulFiles/email.sender");
const uploadDocument = require("../OtherUsefulFiles/upload.document");
const { generateTokenForUSer } = require("../OtherUsefulFiles/token");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
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
      drivingLicense,
      vehiclePhoto,
      vehicleReg,
      profileImage,
    } = req.body;
    if (
      empty(name) ||
      empty(surname) ||
      empty(password) ||
      empty(city) ||
      empty(phone) ||
      empty(email) ||
      empty(role) ||
      empty(city)
    ) {
      return res
        .status(400)
        .json({ msg: "please enter all required fields correctly" });
    }
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
    if (!validator.isMobilePhone(phone, "fr-CM")) {
      return res.status(422).json({ msg: "invalid phone number." });
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

    const new_user_id = await user.create(new_user);
    console.log(role, "role", new_user_id.id, find_role_client.id);
    if (find_role_client.id === parseInt(role)) {
      await user.update(
        { accountStatus: true },
        { where: { id: new_user_id.id } }
      );

      sendEmails(new_user_id, email, name, surname);
      return res.status(201).json({
        msg: "Congratulations! you created your account successfully.",
      });
    } else if (await Role.findOne({ where: { name: "driver" } })) {
      if (
        empty(CNI) ||
        empty(vehiclePhoto) ||
        empty(drivingLicense) ||
        empty(profileImage)
      ) {
        return res.status(400).json({ msg: "upload all require document" });
      }

      const new_driver = await user.create(new_user, { accountStatus: false });
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
        const token = generateTokenForUSer(find_user.id, find_user.role);
        console.log(token);
        return res
          .status(200)
          .json({ token, msg: "Account activated successfully" });
      } else {
        return res.status(200).json({
          msg: "account pending..... waiting for verification",
        });
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
      return res.status(200).json({ success: token });
    }
    return res.status(200).json({
      success: "invalid password and make sure you activate your account",
    });
  }
};