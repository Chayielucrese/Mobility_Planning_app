const { empty } = require("php-in-js/modules/types");
const ReserveVehicle = require("../Models/ReserveVehicle");
const User = require("../Models/user");
const {
  SendPushNotificationToDriver,
} = require("../pushNotification/DriverNotification");
const Reservation = require("../Models/reservation");
const { Op } = require("sequelize");
const Role = require("../Models/role");
const Vehicle = require("../Models/vehicle");

const reservationNotification = require("../OtherUsefulFiles/reservation.notification");
const { geocodeAddressToCoordinates } = require("./Geocoding.controller");
const UserSubscription = require("../Models/UserSubscription");

// Reserve a vehicle
exports.reserveVehicle = async (req, res) => {
  try {
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
    console.log(vehicle_id, "vehicle_idvehicle_id", reservation_id);

    // Step 1: Validate if the vehicle exists
    const vehicle = await Vehicle.findOne({ where: { id: vehicle_id } });
    if (!vehicle) {
      return res.status(404).json({ msg: "Vehicle not found" });
    }

    // Step 2: Fetch driver role
    const role_driver = await Role.findOne({ where: { name: "driver" } });
    if (!role_driver) {
      return res.status(500).json({ msg: "Role Driver not found" });
    }

    // Step 3: Fetch available drivers with approved documents and active subscription
    const conformed_drivers = await User.findAll({
      where: {
        [Op.and]: {
          role: role_driver.id,
          documentStatus: "approved",
          subscription: true,
        },
      },
    });

    if (!reservation_type) {
      return res
        .status(400)
        .json({ msg: "What type of reservation do you prefer?" });
    }

    // Handle instant reservation
    if (reservation_type === "instant") {
      if (!pickup_point) {
        return res.status(400).json({ msg: "Please enter your pickup point" });
      }
      if (!destination) {
        return res.status(400).json({ msg: "Please enter your destination" });
      }

      const pickUpCoordinates = await geocodeAddressToCoordinates(pickup_point);
      const destinationCoordinates = await geocodeAddressToCoordinates(
        destination
      );
      console.log(pickUpCoordinates, "coordinates");
      if (!pickUpCoordinates || !destinationCoordinates) {
        return res.status(500).json({ msg: "Geocoding failed, could not retrieve coordinates" });
      }
  
      const { lat: pickUpLat, lng: pickUpLng } = pickUpCoordinates;
      const { lat: destLat, lng: destLng } = destinationCoordinates;
  
 
      const reservationObj = await ReserveVehicle.create({
        reservationId: reservation_id,
        vehicleId: vehicle_id,
        pickUpPoint: pickup_point,
        pickUpPointLatitude: pickUpLat,
        pickUpPointLongitude: pickUpLng,
        destination: destination,
        destinationLatitude: destLat,
        destinationLongitude: destLng,
        numberOfSeats: number_of_seats,
        reservationtype: reservation_type,
        date: new Date(),
      });
      // Notify drivers and handle response
      await notifyDrivers(
        reservationObj,
        conformed_drivers,
        userObj,
        reservation_id
      );

      return res.status(201).json({
        msg: "Request created successfully but still pending.... you will receive a reply shortly",
      });
    } else if (reservation_type === "advance") {
      if (!advance_pickup_point) {
        return res.status(400).json({ msg: "Please enter your pickup point" });
      }
      if (!advance_destination) {
        return res.status(400).json({ msg: "Please enter your destination" });
      }
      if (!date || !time) {
        return res
          .status(400)
          .json({ msg: "Please specify a date and time for this reservation" });
      }

      // Convert time to 24-hour format
      const formattedTime = convertTo24HourFormat(time);

      const new_reservation = await ReserveVehicle.create({
        reservationId: reservation_id,
        vehicleId: vehicle_id, // Using validated vehicleId
        pickUpPoint: advance_pickup_point,
        destination: advance_destination,
        numberOfSeats: number_of_seats,
        reservationtype: reservation_type,
        timeOfService: formattedTime,
        executionDate: date,
      });

      await notifyDrivers(
        new_reservation,
        conformed_drivers,
        userObj,
        reservation_id
      );

      return res.status(201).json({
        msg: "Request created successfully but still pending.... you will receive a reply shortly",
      });
    } else {
      return res.status(400).json({ msg: "Invalid reservation type" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "An error occurred" });
  }
};

const convertTo24HourFormat = (time) => {
  const [hours, minutes] = time.split(":");
  return time.includes("PM") && hours < 12
    ? `${parseInt(hours) + 12}:${minutes}`
    : time.includes("AM") && hours == 12
    ? `00:${minutes}`
    : `${hours}:${minutes}`;
};

// Helper function to notify drivers
const notifyDrivers = async (reservationObj, conformed_drivers, userObj) => {
  for (const driver_sub of conformed_drivers) {
    const driver_sub_list = await UserSubscription.findOne({
      where: { userId: driver_sub.id },
    });

    const vehicle = await Vehicle.findOne({
      where: {
        owner: driver_sub.id,
        vehicleType: reservationObj.vehicleId, // Fetching vehicle type
      },
    });

    if (vehicle) {
      const userInfo = await User.findOne({
        where: { id: userObj.id },
      });

      await reservationNotification(reservationObj, userInfo, driver_sub.id);
    }
  }
};

//view reservation details

exports.viewPendingReservation = async (req, res) => {
  const userObj = req.user;

  try {
    const pendingBookings = await Reservation.findAll({
      where: {
        [Op.and]: {
          bookingStatus: false,
          userId: userObj.id,
        },
      },
      include: {
        model: Vehicle,
        as: "vehicle",
        through: { model: ReserveVehicle },
        // attributes: [
        //   "id",
        //   "plateNumber",
        //   "vehicleModel",
        //   "vehicleMark",
        //   "vehicleType",
        // ],
      },
    });

    res.json(pendingBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
