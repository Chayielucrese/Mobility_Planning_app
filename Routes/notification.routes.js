const express = require('express')

const router = express.Router()
const notificationCtrl = require('../Controllers/notification.controller')
const checkAuthorization = require('../Middleware/check.auth')
const checkRole = require('../Middleware/role.auth')

router.post('/createNotification/:role_id',checkAuthorization, checkRole(1), notificationCtrl.createNotification )

router.get('/retrieveNotification', checkAuthorization, notificationCtrl.retrieveNotification)
router.post('/sendNotificationToDevice', notificationCtrl.SendNotificationsToUsersDevice)

module.exports = router