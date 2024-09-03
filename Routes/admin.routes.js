const express = require("express");
const userCtrl = require("../Controllers/user.controller");
const router = express.Router();
const checkAuthorization = require("../Middleware/check.auth");
const roleAuthorization = require("../Middleware/role.auth");
const adminCtrl = require("../Controllers/admin.controller");
const Role = require("../Models/role");
const reservationTypeCtrl = require("../Controllers/reservationtypes.controller");
const User = require("../Models/user");
const CheckRole = require("../Middleware/role.auth");

//get role admin
async function getAdminRole() {
  const role = await User.findOne({ where: { name: "admin" } });
  if (!role) {
    console.log("role not found");
  }
  console.log(role);
  return role;
}

//get pending users with role driver
router.get(
  "/pendingDrivers/:role_id",
  checkAuthorization,
  roleAuthorization(1),
  adminCtrl.getAllDriversWithUnverifiedDocuments
);

//get all approved users with role driver
router.get(
  "/getAllDriversWithApprovedDocuments/:role_id",
  checkAuthorization,
  roleAuthorization(1),
  adminCtrl.getAllDriversWithApprovedDocuments
);

//get vehicle details for pending users with role driver
router.get(
  "/pendingDriversVehicleDetails/:role_id/:driver_id",
  checkAuthorization,
  roleAuthorization(1),
  adminCtrl.vehicleDocsForPendingDrivers
);

//view pending bookings
router.get(
  "/viewAllPendingBooking/:role_id",
  checkAuthorization,
  roleAuthorization(1),
  adminCtrl.viewAllPendingBooking
);
//view All vehicle reservation
router.get(
  "/viewAllReservedVehicles/:role_id",
  checkAuthorization,
  roleAuthorization(1),
  adminCtrl.viewAllReservedVehicles
);
//view all booking with reservation type advance
router.get(
  "/viewAllAdvanceReservedVehicles/:role_id",
  checkAuthorization,
  roleAuthorization(1),
  adminCtrl.viewAllAdvanceReservedVehicles
);
//verify and activate user account with role driver
router.get(
  "/verifyAccount/:driver_id",
  checkAuthorization,
  roleAuthorization(parseInt(getAdminRole), userCtrl.verifyDocuments)
);

//add type of reservation to platform
router.post(
  "/addReservationType",
  checkAuthorization,
  roleAuthorization(1),
  reservationTypeCtrl.createAReservationType
);
router.put(
  "/approveDriverOrRejectDriver/:role_id/:driver_id/:doc_new_status",
  checkAuthorization,
  roleAuthorization(1),
  adminCtrl.updateDucmentStatus
);

module.exports = router;
