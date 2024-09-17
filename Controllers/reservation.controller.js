const { now } = require("sequelize/lib/utils");
const Reservation = require("../Models/reservation");
const ReserveVehicle = require("../Models/ReserveVehicle");
const { empty } = require("php-in-js");
const { Op } = require("sequelize");
const User = require("../Models/user");
const { subscribe } = require("../Routes/user.routes.js");
const Reservationtypes = require("../Models/reservationtypes");
const UserSubscription = require("../Models/UserSubscription.js");

exports.createReservation = async (req, res) => {
  try {
    const userObj = req.user;
    const find_user_wallet = await User.findOne(
      {
        where: { id: userObj.id },
      },
      { attributes: ["balance"] }
    );
    if (find_user_wallet && find_user_wallet.balance != parseInt(0)) {
      const new_request = await Reservation.create({
        paymentMode: "wallet",
        userId: userObj.id,
        bookingDate: Date.now(),
        bookingTotalCost: parseFloat(0),
        bookingStatus: false,
      });
      if (new_request) {
        return res.status(201).json({ msg: new_request });
      } else {
        return res
          .status(201)
          .json({ msg: "An error occured while creating request" });
      }
    } else {
      const new_request = await Reservation.create({
        paymentMode: "cash",
        userId: userObj.id,
        bookingDate: Date.now(),
        bookingTotalCost: parseFloat(0),
        bookingStatus: false,
      });
      if (new_request) {
        return res.status(201).json({ msg: new_request });
      } else {
        return res
          .status(201)
          .json({ msg: "An error occured while creating request" });
      }
    }
  } catch (err) {
    console.log("an error occured", err);
    return res.status(500).json({ msg: "internal server error" });
  }
};
//cancel reservation
exports.cancelBooking = async (req, res) => {
  try {
    const userObj = req.user;
    console.log(userObj.id);

    const reservation_id = req.params.reservation_id;
    const request_owner = await Reservation.findOne({
      where: {
        [Op.and]: [{ userId: userObj.id }, { id: reservation_id }],
      },
    });
    if (request_owner) {
      await Reservation.destroy({ where: { id: reservation_id } });
      return res
        .status(200)
        .json({ msg: "Your Reservation was cancelled successfully" });
    }
    return res.status(400).json({ msg: "Fail to cancel request" });
  } catch (err) {
    console.log("error occured", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//view  non pending reservations non pending by user id
exports.getActiveReservationsByUser = async (req, res) => {
  try {
    const userObj = req.user;

    // Fetching reservations for the user
    const booking_history = await Reservation.findAll({
      where: {
        userId: userObj.id,
      },
    });

    console.log(booking_history);

    return res.status(200).json({ msg: booking_history });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

//view pending reservations
exports.getPendingReservationsByUser = async (req, res) => {
  const userObj = req.user;
  console.log(userObj.id);

  const booking_history = await Reservation.findAll({
    where: { [Op.and]: [{ userId: userObj.id }, { bookingStatus: false }] },
  });
  return res.status(200).json({ msg: booking_history });
};

//view reservation datails
exports.viewReservationDetails = async (req, res) => {
  try {
    const find_user_pending_reservation = await Reservation.findOne({
      where: { [Op.and]: { userId: req.user.id, bookingStatus: false } },
    });
    console.log(
      find_user_pending_reservation,
      "hrlllloooooooooooo",
      find_user_pending_reservation.id
    );
    if (find_user_pending_reservation) {
      const get_his_reservation_details = await ReserveVehicle.findOne({
        where: {
          reservationId: find_user_pending_reservation.id,
        },
      });
      console.log(
        get_his_reservation_details,
        "get ride",
        find_user_pending_reservation.id
      );

      if (get_his_reservation_details) {
        return res.status(200).json({ Request:{
          pickUpPoint: get_his_reservation_details.pickUpPoint,
          destination: get_his_reservation_details.destination,
          numberOfSeats: get_his_reservation_details.numberOfSeats,
          pickUpPointCoordinates:
            get_his_reservation_details.pickUpPointCoordinates,
          destinationCoordinates:
            get_his_reservation_details.destinationCoordinates,
          reservedVehicleFee: get_his_reservation_details.reservedVehicleFee,
          date: get_his_reservation_details.date,
          reservationtype: get_his_reservation_details.reservationtype,
          bookingStatus: find_user_pending_reservation.bookingStatus,
          bookingTotalCost: find_user_pending_reservation.bookingTotalCost,
          paymentStatus: find_user_pending_reservation.paymentStatus,
          paymentMode: find_user_pending_reservation.paymentMode,
        }
        });
      } else {
        return res.json({
          msg: "An error accured while fetching data",
          get_his_reservation_details,
        });
      }
    }
  } catch (err) {
    console.log(err, "error occured");

    return res.status(500).json({ msg: "internal server error" });
  }
};

//driver view request according to subscription

// controller function
// controller function
exports.viewRequestAccordingToSubscription = async (req, res) => {
  try {
    const check_if_subscribed = await User.findOne({
      where: { [Op.and]: { id: req.user.id, subscription: true } },
    });
    console.log(check_if_subscribed, "confirmation_subscribed");

    if (check_if_subscribed) {
      const get_type_of_subscription = await UserSubscription.findOne({
        where: { userId: req.user.id },
        attributes: ["subscriptionId"],
      });

      if (get_type_of_subscription) {
        const get_sub_name = await Reservationtypes.findOne({
          where: { id: get_type_of_subscription.subscriptionId },
          attributes: ["name", "price"],
        });

        if (get_sub_name.name === "Instant Service Only") {
          const get_instance_service_request_only =
            await ReserveVehicle.findAll({
              where: { reservationtype: "instant" },
            });

          return res
            .status(200)
            .json({ reservationRequest: get_instance_service_request_only });
        }
      }
    } else {
      return res
        .status(404)
        .json({ msg: "No subscription or matching requests found" });
    }
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({ msg: "internal server error" });
  }
};
