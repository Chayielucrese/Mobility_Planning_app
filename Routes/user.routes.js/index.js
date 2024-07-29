const express = require("express");
const router = express.Router();
const userCtrl = require("../../Controllers/user.controller");

//create user
router.post("/createUser", userCtrl.createUser);

//delete user by id
router.delete('/deleteById/:user_id', userCtrl.deleteUserById)

//login user
router.post('/userLogin', userCtrl.userLogin)

//activate account
router.put('/activateAccount', userCtrl.verifyCode)
module.exports = router;
