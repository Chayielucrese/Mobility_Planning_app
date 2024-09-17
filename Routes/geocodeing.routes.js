const express = require('express')
const geocodingCtrl = require('../Controllers/Geocoding.controller')
const checkAuthorization = require('../Middleware/check.auth')
const router = express.Router()

router.get('/geocodeAddress',   geocodingCtrl.geocodeAddressToCoordinates)




module.exports = router