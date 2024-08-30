
const express = require('express')
const reservationCtrl = require('../Controllers/reservation.controller')
const checkAuthorization = require('../Middleware/check.auth')
const router = express.Router()
//create reservation
router.post('/createReservation',  checkAuthorization, reservationCtrl.createReservation)
//cancel reservation
router.delete('/cancelReservation/:reservation_id', checkAuthorization, reservationCtrl.cancelBooking)
//view non pending reservations
router.get('/bookingHistory', checkAuthorization, reservationCtrl.getActiveReservationsByUser)
//view pending reservations
router.get('/pendingBooking', checkAuthorization, reservationCtrl.getPendingReservationsByUser)

module.exports = router