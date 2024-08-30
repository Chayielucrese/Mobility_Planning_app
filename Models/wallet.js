const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
// Define the Wallet model
const Wallet = sequelize.define("Wallet", {
    currentBalance: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    walletPassword: {
        type: DataTypes.STRING,
        allowNull: false
    }
  });
  

  Wallet.sync()
    .then(() => {
      console.log("Wallet created successfully");
    })
    .catch((err) => {
      console.log("Failed to create model", err);
    });
  
  module.exports = Wallet;