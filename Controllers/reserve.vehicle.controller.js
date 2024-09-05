const { empty } = require("php-in-js/modules/types");
const ReserveVehicle = require("../Models/ReserveVehicle");
const User = require("../Models/user");
const {
  SendPushNotificationToDriver,
} = require("../pushNotification/DriverNotification");
const Reservation = require("../Models/reservation");
const { Op, where, BOOLEAN } = require("sequelize");
const Role = require("../Models/role");
const Vehicle = require("../Models/vehicle");
const Ride = require("../Models/rides.");
const e = require("express");
const notification = require("../OtherUsefulFiles/notification");
//reserve a vehicle
exports.reserveVehicle = async (req, res) => {
  const userObj = req.user;

  const {
    pickup_point,
    destination,
    reservation_type,
    advance_pickup_point,
    advance_destination,
    date,
    time,
    number_of_seats,
  } = req.body;
  const vehicle_id = req.params.vehicle_id;

  const reservation_id = req.params.reservation_id;

  //find the object with name role
  const role_driver = await Role.findOne({where: {name:"driver"}})

  
  const conformed_drivers = await User.findAll({
    where: {
      [Op.and]: {
        role: role_driver.id,
        documentStatus: "approved",
        subscription: true,
      },
    },
  });
  
  // const get_vehicle_type = await Ride.findOne(
  //   { where: { id: vehicle_id } },
  //   { attributes: ["name"] }
  // );

  // const user_details = await User.findOne({ where: { id: userObj.id } });
  if (empty(reservation_type)) {
    return res
      .status(400)
      .json({ msg: "What type of reservation do you prefer" });
  }

  if (reservation_type === "instant") {
    if (empty(pickup_point)) {
      return res.status(400).json({ msg: "Please enter your pickup point" });
    } else if (empty(destination)) {
      return res.status(400).json({ msg: "Please enter your destination" });
    }
    await ReserveVehicle.create({
      reservationId: reservation_id,
      vehicleId: vehicle_id,
      pickUpPoint: pickup_point,
      destination: destination,
      numberOfSeats: number_of_seats,
      reservationtype: reservation_type,
    });

    if (conformed_drivers) {

      
      const reservation_details = await Reservation.findOne({
        where: { [Op.and]: { id: reservation_id, userId: userObj.id } },
      });


      if (reservation_details) {
  

        conformed_drivers.forEach(async (driver) => {
          
          if (
            await Vehicle.findOne({
              where: {
                [Op.and]: {
                  owner: driver.id,
                  vehicleType: get_vehicle_type.name,
                },
              },
            })
          ) {


            notification(driver);
       
            
          }
        });
        return res.status(201).json({
          msg: "Request created successfully but still pending.... you will recieve a reply shortly",
        });
      } else {
        return res.status(201).json({
          msg: "Your request encounted some problems please try again later",
        });
      }
    } else {
      return res.status(404).json({
        msg: "No Driver available at the moment",
      });
    }
  } else if (reservation_type === "advance") {
    if (empty(advance_pickup_point)) {
      return res.status(400).json({ msg: "Please enter your pickup point" });
    } else if (empty(advance_destination)) {
      return res.status(400).json({ msg: "Please enter your destination" });
    } else if (empty(date) || empty(time)) {
      return res
        .status(400)
        .json({ msg: "Please specify a date and time for this reservation" });
    }

    // Convert time to 24-hour format if needed
    const [hours, minutes] = time.split(":");
    let formattedTime;
    if (time.includes("PM") && hours < 12) {
      formattedTime = `${parseInt(hours) + 12}:${minutes}`;
    } else if (time.includes("AM") && hours == 12) {
      formattedTime = `00:${minutes}`;
    } else {
      formattedTime = `${hours}:${minutes}`;
    }

    const new_reservation = await ReserveVehicle.create({
      reservationId: reservation_id,
      vehicleId: vehicle_id,
      pickUpPoint: advance_pickup_point,
      destination: advance_destination,
      numberOfSeats: number_of_seats,
      reservationtype: reservation_type,
      timeOfService: formattedTime,
      executionDate: date,
    });

    if (conformed_drivers) {
      const reservation_details = await Reservation.findOne({
        where: { [Op.and]: { id: reservation_id, userId: userObj.id } },
      });
      if (reservation_details) {
        conformed_drivers.forEach(async (driver) => {
          const vehicle = await Vehicle.findOne({
            where: {
              [Op.and]: {
                owner: driver.id,
                vehicleType: get_vehicle_type.name,
              },
            },
          });
          if (vehicle) {
            SendPushNotificationToDriver(
              new_reservation.destination,
              new_reservation.pickUpPoint,
              new_reservation.executionDate,
              new_reservation.timeOfService,
              user_details.name,
              user_details.surname,
              driver.id
            );
          }
        });
      }
      return res.status(201).json({
        msg: "Request created successfully but still pending.... you will receive a reply shortly",
      });
    } else {
      return res.status(201).json({
        msg: "Your request encounted some problems please try again later",
      });
    }
  } else {
    return res.status(404).json({
      msg: "No Driver available at the moment",
    });
  }
};
