const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const Reservation = require("../Models/reservation");
const Vehicle = require("../Models/vehicle");
const vehicle = require("../Models/vehicle");

// Define the UserRole model
const ReserveVehicle = sequelize.define("ReserveVehicle", {
  reservationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Reservation,
      key: "id",
    },
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    references: {
      model: vehicle,
      key: "id",
    },
  },
  pickUpPoint: { type: DataTypes.STRING, allowNull: false },
  
  destination: { type: DataTypes.STRING, allowNull: false },
  reservedVehicleFee: { type: DataTypes.FLOAT },
  numberOfSeats: { type: DataTypes.INTEGER, defaultValue: 1 },
  seatNumbeatior: { type: DataTypes.INTEGER },
  timeOfService: { type: DataTypes.TIME },
  executionDate: {type: DataTypes.DATE},
  reservationtype: { type: DataTypes.ENUM("advance", "instant") },
});
ReserveVehicle.sync()
  .then(() => {
    console.log("ReserveVehicle created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = ReserveVehicle;
