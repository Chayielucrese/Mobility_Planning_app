const Subscriptions = require("../Models/reservationtypes");
const User = require("../Models/user");
const UserSubscription = require("../Models/UserSubscription");

// Define many-to-many relationships
User.belongsToMany(Subscriptions, {
  through: UserSubscription,
  as: "reservationtypes",
  foreignKey: "subscriptionId",
});
Subscriptions.belongsToMany(User, {
  through: UserSubscription,
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
