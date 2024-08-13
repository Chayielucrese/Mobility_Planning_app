const express = require("express");
const userCtrl = require("../Controllers/user.controller");
const router = express.Router();
const checkAuthorization = require("../Middleware/check.auth");
const roleAuthorization = require("../Middleware/role.auth");
const adminCtrl = require('../Controllers/admin.controller')
const Role = require("../Models/role");
const User = require("../Models/user");

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
  "/pendingDrivers/:role",
  checkAuthorization,
  roleAuthorization(parseInt(getAdminRole())),
  adminCtrl.getAllDriversWithUnverifiedDocuments
);

//verify and activate user account with role driver
router.get(
  "/verifyAccount/:driver_id",
  checkAuthorization,
  roleAuthorization(parseInt(getAdminRole), userCtrl.verifyDocuments)
);

module.exports = router;
