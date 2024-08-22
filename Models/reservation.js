const { Timestamp } = require("firebase-admin/firestore");
const { Sequelize, DataTypes, TIME } = require("sequelize");

const Reservation = Sequelize.afterDefine("Reservation", {
  bookingStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
  bookingTotalCost: { type: DataTypes.FLOAT },
  reservationType:{type: DataTypes.ENUM("advance", "instant"),},
  userId: { type: DataTypes.INTEGER, allowNull: false },
  paymentStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
  paymentMode: { type: DataTypes.STRING, allowNull: false },
  bookingDate: { type: DataTypes.DATE },
  bookingTime: { type: TIME },
});

Reservation.sync()
  .then(() => {
    console.log("Reservation created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = Reservation;
