const express = require("express");
const router = express.Router();
const statsCtrl = require("../Controllers/statistics.contoller");
const checkAuthorization = require("../Middleware/check.auth");
const checkRole = require("../Middleware/role.auth");

// get number of vehicles
router.get("/totalVehicle", checkAuthorization, statsCtrl.TotalNmOfVehicles);

//get document status
// router.get('/docStatus', checkAuthorization, statsCtrl.DocumentStatus);

//number of drivers

router.get(
  "/userRoleState",
  checkAuthorization,
  checkRole(1),
  statsCtrl.numberOfDrivers
);
module.exports = router;
