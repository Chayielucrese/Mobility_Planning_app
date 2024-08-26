const { Op, where } = require("sequelize");
const wallet = require("../Models/Wallet");
const { empty } = require("php-in-js/modules/types");
const bcrypt = require("bcrypt");
exports.createWallet = async (req, res) => {
  try {
    const userObj = req.user;
    const { password } = req.body;
    console.log(password, "my pwd");

    if (!(await wallet.findOne({ where: { userId: userObj.id } }))) {
      if (empty(password) || !password || isNaN(password)) {
        return res
          .status(400)
          .json({ msg: "Password must be a numeric value." });
      }

      if (password.length < 5 || password.length > 5) {
        return res.status(400).json({
          msg: "Your PIN code must be 5 numbers long",
        });
      }
      if (
        !(await wallet.create({
          userId: userObj.id,
          currentBalace: 0,
          walletPassword: bcrypt.hashSync(password, 10),
        }))
      ) {
        return res
          .status(400)
          .json({ msg: "An error occured while creating wallet" });
      } else {
        return res.status(201).json({ msg: "wallet created successfully" });
      }
    } else {
      return res.status(409).json({ msg: "you already have a wallet" });
    }
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
//view wallet
exports.viewWallet = async (req, res) => {
  const userObj = req.user;
  const { password } = req.body;

  if (password === null) {
    return res.status(400).json({
      msg: "Enter the password to your wallet",
    });
  }
  console.log("password", password);

  const my_wallet = await wallet.findOne({ where: { userId: userObj.id } });

  if (!my_wallet) {
    return res.status(404).json({
      msg: "We can't find your wallet please try again later or create a wallet",
    });
  }
  const match_password = await wallet.findOne({
    where: {
      walletPassword: bcrypt.compareSync(password, my_wallet.walletPassword),
    },
  });
  console.log(match_password, "password");

  if (match_password) {
    return res
      .status(200)
      .json({ msg: { currentBalance: my_wallet.currentBalance } });
  } else {
    return res.status(400).json({ mgs: "incorrect password" });
  }
};
