const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");

const Notification = sequelize.define("Notification", {
  userId: { type: DataTypes.INTEGER },
  subject: { type: DataTypes.STRING },
  content: { type: DataTypes.STRING },
  read: {type: DataTypes.BOOLEAN, defaultValue: false}
});

Notification.sync()
  .then(() => {
    console.log("Notification created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });

module.exports = Notification;
