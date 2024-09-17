const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");

const Notification = sequelize.define("Notification", {
  driverId: { type: DataTypes.INTEGER },
  subject: { type: DataTypes.STRING },
  content: { type: DataTypes.STRING },
  notificationType:{type: DataTypes.ENUM("documentStatus", "reservation")},
  read: {type: DataTypes.BOOLEAN, defaultValue: false},
  pickUpPoint: {type: DataTypes.STRING},
  destination: {type: DataTypes.STRING},
  date: {type:DataTypes.DATE, defaultValue: new Date()},
  userName: {type: DataTypes.STRING},
  userSurname: {type: DataTypes.STRING},
  userPhone: {type: DataTypes.STRING}
  
});

Notification.sync()
  .then(() => {
    // console.log("Notification created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });

module.exports = Notification;
