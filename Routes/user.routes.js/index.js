const express = require("express");
const router = express.Router();
const userCtrl = require("../../Controllers/user.controller");
const checkAuthorization = require("../../Middleware/check.auth");
const reservationTypeCtrl = require("../../Controllers/reservationtypes.controller");
const geoapifyCtrl = require("../../Geolocation/index");
const subscriptionCtrl = require('../../Controllers/user.subscription.controller')
//create user
router.post("/createUser", userCtrl.createUser);

//delete user by id
router.delete("/deleteById/:user_id", userCtrl.deleteUserById);

//login user
router.post("/userLogin", userCtrl.userLogin);

//activate account
router.put("/activateAccount", userCtrl.verifyCode);

//profile update
router.put("/editProfile", checkAuthorization, userCtrl.editProfile);

//get user profile
router.get("/getUserProfile", checkAuthorization, userCtrl.getUserProfile);

//view all uploaded documents
router.get(
  "/viewUploadedDocuments",
  checkAuthorization,
  userCtrl.viewUploadedDocuments
);

//view reservation types
router.get(
  "/getAllReservationTtypes",
  checkAuthorization,
  reservationTypeCtrl.getAllReservationTypes
);

//get places
router.get("/getPlaces",checkAuthorization, geoapifyCtrl.getPlaces);
module.exports = router;

//perform subscription
router.post('/mySubscription/:subscription_id', checkAuthorization, subscriptionCtrl.UserPerformsubscription)