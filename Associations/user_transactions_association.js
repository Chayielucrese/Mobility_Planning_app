const User = require("../Models/user");
const Transaction = require("../Models/transaction");

// Define one-to-many relationship
User.hasMany(Transaction, {
  as: "transactions",
  foreignKey: "userId",
});
Transaction.belongsTo(User, {
  as: "users",
  foreignKey: "transactionId",
});

sequelize
  .sync()
  .then(() => {
    console.log("Models synced successfully");
  })
  .catch((err) => {
    console.log("Failed to sync models", err);
  });
