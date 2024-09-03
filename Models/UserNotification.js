const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const User = require("./user");
const Notification = require("./Notification");

const UserNotification = sequelize.define("Subcription", {
  notificationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Notification,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
});
UserNotification.sync()
  .then(() => {
    console.log("UserNotification model  created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = UserSubscription;
