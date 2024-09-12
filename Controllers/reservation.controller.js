const { now } = require("sequelize/lib/utils");
const Reservation = require("../Models/reservation");

const { empty } = require("php-in-js");
const { Op } = require("sequelize");
const User = require("../Models/user");

exports.createReservation = async (req, res) => {
  try {
    const userObj = req.user;
    const find_user_wallet = await User.findOne({
      where: { userId: userObj.id },
    }, {attributes:["balance"]});
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
          [Op.and]: [
            { userId: userObj.id },
            { id: reservation_id }
          ]
        }
      });
    if (request_owner) {
      await Reservation.destroy(
   
        { where: { id: reservation_id } }
      );
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
exports.getPendingReservationsByUser = async (req, res)=> {
    const userObj = req.user
    console.log(userObj.id);
    
 const booking_history =   await Reservation.findAll({where:   
   { [Op.and]: [
      { userId: userObj.id },
      { bookingStatus: false }
    ]
  }})
 return res.status(200).json({ msg: booking_history });
}