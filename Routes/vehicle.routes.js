const express = require('express')
const router = express.Router()
const vehicleCtrl = require('../Controllers/vehicle.controller')
const checkAuthorization = require('../Middleware/check.auth') 

//add vehicle
router.post("/addVehicle", checkAuthorization, vehicleCtrl.createVehicle)

//view vehicle details
router.get('/viewVehicleDetails/:vehicle',checkAuthorization, vehicleCtrl.viewVehicleDetails)

//get all user verhicle
router.get('/viewAllVehicles',checkAuthorization, vehicleCtrl.getAllVehicles)

//delete vehicle by id
router.delete('/deleteVehicleById/:vehicle',checkAuthorization,  vehicleCtrl.deleteVehicle)
module.exports = router