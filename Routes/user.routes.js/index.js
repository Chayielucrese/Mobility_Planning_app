const express = require("express");
const router = express.Router();
const userCtrl = require("../../Controllers/user.controller");
const checkAuthorization = require("../../Middleware/check.auth");
const reservationTypeCtrl = require("../../Controllers/reservationtypes.controller");
const geoapifyCtrl = require("../../Geolocation/index");
const reservationCtrl = require("../../Controllers/reservation.controller");
const subscriptionCtrl = require("../../Controllers/user.subscription.controller");
const { re } = require("mathjs");
const checkSubscription = require("../../Middleware/check_subscription_expiration");
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

//get request according to subscription
router.get(
  "/getMyRequest",
  checkAuthorization,
  checkSubscription,
  reservationCtrl.viewRequestAccordingToSubscription
);

//get places
router.get("/getPlaces", checkAuthorization, geoapifyCtrl.getPlaces);

//get reservationt Details
router.get(
  "/viewReservationDetails",
  checkAuthorization,
  reservationCtrl.viewReservationDetails
);

//perform subscription
router.post(
  "/mySubscription/:subscriptionId",
  checkAuthorization,
  subscriptionCtrl.UserPerformsubscription
);

//view your subscription details
router.get('/viewSubsriptionDetails', checkAuthorization, subscriptionCtrl.viewSubsriptionDetails)
module.exports = router;
