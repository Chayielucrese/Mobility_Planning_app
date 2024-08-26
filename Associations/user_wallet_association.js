const User = require("../Models/user");
const Wallet = require("../Models/Wallet");

// Define one-to-one relationshipss
User.hasOne(Wallet, {
  as: "wallets",
  foreignKey: "userId",
});
Wallet.belongsTo(User, {
  as: "users",
  foreignKey: "userId",
});

sequelize
  .sync()
  .then(() => {
    console.log("Models synced successfully");
  })
  .catch((err) => {
    console.log("Failed to sync models", err);
  });
