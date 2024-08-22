const express = require('express')
const router = express.Router()
const roleCtrl = require('../../Controllers/role.controller')
const checkAuthorization = require('../../Middleware/check.auth')
const checkRole = require('../../Middleware/role.auth')

router.post("/createRole",checkAuthorization, checkRole(1),  roleCtrl.createRole)

router.delete('/delteRoleById/:role_id',checkAuthorization, checkRole(1),   roleCtrl.deleteRoleById)

router.get('/getRoles', roleCtrl.getAllRole)
module.exports= router