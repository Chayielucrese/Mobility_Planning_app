const Reservation = require("../Models/reservation");
const Vehicle = require("../Models/vehicle");
const ReserveVehicle = require("../Models/ReserveVehicle");


Vehicle.belongsToMany(Reservation, {
  through: ReserveVehicle,
  as: "reservations",
  foreignKey: "vehicleId",
});
Reservation.belongsToMany(Vehicle, {
  through: ReserveVehicle,
  as: "vehicles",
  foreignKey: "reservationId",
});

sequelize
  .sync()
  .then(() => {
    console.log("Models synced successfully");
  })
  .catch((err) => {
    console.log("Failed to sync models", err);
  });

