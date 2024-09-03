const User = require("../Models/user");
const Notification = require("../Models/role");
const UserNotification = require("../Models/UserNotification");

// Define many-to-many relationships
User.belongsToMany(Notification, {
  through: UserNotification,
  as: "notifications",
  foreignKey: "userId",
});
Notification.belongsToMany(User, {
  through: UserNotification,
  as: "users",
  foreignKey: "notificationId",
});

sequelize
  .sync()
  .then(() => {
    console.log("Models synced successfully");
  })
  .catch((err) => {
    console.log("Failed to sync models", err);
  });
