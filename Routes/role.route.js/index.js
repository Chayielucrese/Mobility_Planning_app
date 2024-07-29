const express = require('express')
const router = express.Router()
const roleCtrl = require('../../Controllers/role.controller')

router.post("/createRole", roleCtrl.createRole)

router.delete('/delteRoleById/:role_id', roleCtrl.deleteRoleById)

router.get('/getRoles', roleCtrl.getAllRole)
module.exports= router