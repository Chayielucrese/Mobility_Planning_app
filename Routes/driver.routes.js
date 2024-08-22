const express = require('express')
const driverCtrl = require('../Controllers/driver.controller')
const checkAuthorization = require('../Middleware/check.auth')
const router = express.Router()

router.get('/getAvailableDrivers',  checkAuthorization, driverCtrl.getAllAvailableDrivers)


module.exports = router