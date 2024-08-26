const Reservation = require('../Models/reservation');

const {empty} = require('php-in-js')
exports.createReservation = async ( req, res)=>{
    const userObj = req.user
    const { payment_mode, date, time, paymentStatus,  total_cost} = req.body

   if(empty(payment_mode)){
    return res.status(400).json({msg:"Through what meants of payment would you like to pay this reservation? "})
   }


}


