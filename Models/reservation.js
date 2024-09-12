
const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");


//create reservation
const Reservation = sequelize.define("Reservation", {
  bookingStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
  bookingTotalCost: { type: DataTypes.FLOAT },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  paymentStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
  paymentMode: {
    type: DataTypes.ENUM("wallet", "cash"),
    allowNull: false,
    defaultValue: "wallet",
  },
  bookingDate: { type: DataTypes.DATE },
  bookingTime: { type: DataTypes.TIME },
  bookingTotalCost: { type: DataTypes.FLOAT },
  cancelBooking: {type: DataTypes.BOOLEAN, defaultValue: false}
});


Reservation.sync()
  .then(() => {

  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = Reservation;
