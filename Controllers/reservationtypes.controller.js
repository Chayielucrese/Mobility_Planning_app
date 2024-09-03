const Reservation = require("../Models/reservation");
const ReservationType = require("../Models/reservationtypes");
const { empty } = require("php-in-js");

exports.createAReservationType = async (req, res) => {
  const { name, description, reconmendation, price } = req.body;

  if (empty(name) || empty(price)) {
    return res.status(400).json({ msg: "The field name is required" });
  } else if (empty(description) || description.length > 500) {
    console.log(description.length, "ength");

    return res
      .status(400)
      .json({ msg: "please provide a brief description to this reservation" });
  } else {
    await ReservationType.create({ name, description, reconmendation, price });
    return res
      .status(201)
      .json({ msg: "reservation type created successfully" });
  }
};

//get all reservationTypes

exports.getAllReservationTypes = async (req, res) => {
  try {
    const reservationTypeList = await ReservationType.findAll();

    if (reservationTypeList.length === 0) {
      return res.status(200).json({ msg: "No Reservation Type Yet" });
    } else {
        console.log("good");
        
      return res.status(200).json({
        reservationTypeList: reservationTypeList,
      });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

//view booking history
// exports.viewBookingHistory = async(req, res)=>{
//   const userObj = req.user
//   const find_he_reservations = await Reservation.findAll({where: {userId: userObj.id}1})
// }