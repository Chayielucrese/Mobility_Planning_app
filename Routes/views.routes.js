const express = require('express')
const router = express.Router()
const vehicleCtrl = require('../Controllers/vehicle.controller')
const checkAuthorization = require('../Middleware/check.auth') 






  router.get('/cancel', (req, res)=>{
    res.render('index', {title: 'TRANSACTION WAS CANCELLED'} )
  })
  router.get('/success', (req, res)=>{
    res.render('success', {title: 'SUCCESSFUL TRANSACTION'} )
  })
module.exports = router