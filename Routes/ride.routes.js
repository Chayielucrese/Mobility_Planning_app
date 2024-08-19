const express = require('express')
const router = express.Router()
const checkAuthorization = require('../Middleware/check.auth')
const adminRole = require('../Middleware/role.auth')
const rideCtrl = require('../Controllers/ride.controller')
const { getRoleAdmin } = require('../OtherUsefulFiles/get.role.for.routes')

//create ride
async function getRole () {
    const role = await getRoleAdmin()

    return role
    
    }

router.post('/createRide', checkAuthorization, adminRole(4), rideCtrl.createRide )

router.get('/getRides', checkAuthorization, rideCtrl.getRides)

module.exports = router;