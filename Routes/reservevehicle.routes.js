const express = require('express')
const reservevehicleCtrl = require('../Controllers/reserve.vehicle.controller')
const checkAuthorization = require('../Middleware/check.auth')
const checkRole = require('../Middleware/role.auth')
const router = express.Router()

router.post('/reserveVehicle/:vehicle_id/:reservation_id',  checkAuthorization,checkRole(2), reservevehicleCtrl.reserveVehicle)

//view reserved vehicles

router.get('/viewPendingReservation', checkAuthorization, reservevehicleCtrl.viewPendingReservation)
module.exports = router