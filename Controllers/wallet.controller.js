
const wallet = require("../Models/Wallet");
const { empty } = require("php-in-js/modules/types");
const User = require("../Models/user");
const bcrypt = require("bcrypt");

//create Wallet
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
//View Wallet
exports.viewWallet = async (req, res) => {
  try {
    const userObj = req.user;
    const { password } = req.body;

    if (empty(password)) {
      return res.status(400).json({
        msg: "Enter the password to your wallet",
      });
    }
    const my_wallet = await wallet.findOne({ where: { userId: userObj.id } });

    if (!my_wallet) {
      return res.status(404).json({
        msg: "We can't find your wallet. Please try again later or create a wallet.",
      });
    }
    console.log(my_wallet.walletPassword, "walletPassword");

    const compare_password = bcrypt.compareSync(
      password,
      my_wallet.walletPassword
    );

    if (compare_password) {
      return res
        .status(200)
        .json({ msg: { currentBalance: my_wallet.currentBalance } });
    } else {
      return res.status(400).json({ msg: "Incorrect password" });
    }
  } catch (err) {
    console.error("Error viewing wallet: ", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
//Recharge Wallet
exports.rechargeAccount = async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const userObj = req.user;

    if (!phone || !amount) {
      return res.status(400).json({ msg: "Enter all required fields" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ msg: "Invalid amount format" });
    }

    const user_with_phone = await User.findOne({
      where: { id: userObj.id },
      attributes: ["phone"],
    });

    if (!user_with_phone) {
      return res.status(404).json({ msg: "Phone number does not exist" });
    }

    if (user_with_phone.phone !== phone) {
      return res
        .status(404)
        .json({ msg: "This phone number does not correspond to our data" });
    }

    const user_wallet = await wallet.findOne({
      where: { userId: userObj.id },
    });

    if (!user_wallet) {
      return res.status(404).json({ msg: "Wallet not found" });
    }

    console.log("Current Balance:", user_wallet.currentBalance);

    // Ensure 'currentBalance' is a number
    const currentBalance = parseFloat(user_wallet.currentBalance) || 0.0;
    const updatedBalance = currentBalance + parsedAmount;

    if (isNaN(updatedBalance)) {
      return res.status(400).json({ msg: "Error calculating the new balance" });
    }

    await user_wallet.update({ currentBalance: updatedBalance });

    return res.status(200).json({ msg: { currentBalance: updatedBalance } });
  } catch (err) {
    console.error("Recharging failed: ", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
