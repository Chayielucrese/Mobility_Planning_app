const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const Reservation = require("../Models/reservation");
const Vehicle = require("../Models/vehicle");

// Define the ReserveVehicle model
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
      model: Vehicle,
      key: "id",
    },
  },
  pickUpPoint: { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  pickUpPointLatitude: { type: DataTypes.FLOAT },   // Separate field for latitude
  pickUpPointLongitude: { type: DataTypes.FLOAT },  // Separate field for longitude
  destinationLatitude: { type: DataTypes.FLOAT },   // Separate field for destination latitude
  destinationLongitude: { type: DataTypes.FLOAT },
  reservedVehicleFee: { type: DataTypes.FLOAT },
  numberOfSeats: { type: DataTypes.INTEGER, defaultValue: 1 },
  seatNumber: { type: DataTypes.INTEGER }, // Fixed typo
  timeOfService: { type: DataTypes.TIME },
  date: { type: DataTypes.DATE },
  executionDate: { type: DataTypes.DATE },
  reservationtype: { type: DataTypes.ENUM("advance", "instant") },
});

// Sync the models
ReserveVehicle.sync()
  .then(() => {
    console.log("Models synced successfully");
  })
  .catch((err) => {
    console.log("Failed to sync models", err);
  });

module.exports = ReserveVehicle;
