const Reservation = require("../Models/reservation");
const Vehicle = require("../Models/vehicle");
const ReserveVehicle = require("../Models/ReserveVehicle");

// Define many-to-many relationships
User.belongsToMany(Reservation, {
  through: ReserveVehicle,
  as: "reservations",
  foreignKey: "reservationId",
});
Role.belongsToMany(Vehicle, {
  through: ReserveVehicle,
  as: "vehicles",
  foreignKey: "vehicleId",
});

sequelize
  .sync()
  .then(() => {
    console.log("Models synced successfully");
  })
  .catch((err) => {
    console.log("Failed to sync models", err);
  });
