const User = require("../Models/user");
const Role = require("../Models/role");
const { empty } = require("php-in-js");
const { Op } = require("sequelize");
const Vehicle = require("../Models/vehicle");
const ReservedVehicle = require("../Models/ReserveVehicle");
const Reservation = require("../Models/reservation");
const sendMessage = require('../index');
const notification = require("../OtherUsefulFiles/notification");

exports.getAllDriversWithUnverifiedDocuments = async (req, res) => {
  try {
    const role_id = req.params.role_id;

    const admin_role = await Role.findOne({ where: { name: "admin" } });

    if (admin_role && admin_role.id === parseInt(role_id)) {
      const role_driver = await Role.findOne({ where: { name: "driver" } });

      if (!role_driver) {
        return res.status(404).json({ msg: "No driver role found" });
      }

      const unverified_drivers = await User.findAll({
        where: {
          [Op.and]: [
            { documentStatus: "unverified" },
            { role: role_driver.id },
          ],
        },
      });

      if (empty(unverified_drivers)) {
        return res.status(200).json({ msg: "No Pending Drivers" });
      }
      console.log(unverified_drivers, "hiiii");

      return res.status(200).json({
        unverified_drivers: unverified_drivers,
      });
    }

    return res
      .status(400)
      .json({ msg: "You are not authorized for this action" });
  } catch (error) {
    console.error("Error fetching drivers with unverified documents:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.getAllDriversWithApprovedDocuments = async (req, res) => {
  try {
    const role_id = req.params.role_id;

    const admin_role = await Role.findOne({ where: { name: "admin" } });

    if (admin_role && admin_role.id === parseInt(role_id)) {
      const role_driver = await Role.findOne({ where: { name: "driver" } });

      if (!role_driver) {
        return res.status(404).json({ msg: "No driver role found" });
      }

      const approved_drivers = await User.findAll({
        where: {
          [Op.and]: [{ documentStatus: "approved" }, { role: role_driver.id }],
        },
      });

      if (empty(approved_drivers)) {
        return res.status(200).json({ msg: "No Pending Drivers" });
      }
      console.log(approved_drivers, "hiiii");

      return res.status(200).json({
        approved_drivers: approved_drivers,
      });
    }

    return res
      .status(400)
      .json({ msg: "You are not authorized for this action" });
  } catch (error) {
    console.error("Error fetching drivers with unverified documents:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.updateDucmentStatus = async (req, res) => {
  const role_id = req.params.role_id;
  const driver_id = req.params.driver_id;
  const doc_new_status = req.params.doc_new_status;
  if (empty(doc_new_status)) {
    doc_new_status = "unverified";
  } else if (!["approved", "rejected"].includes(doc_new_status)) {
    return res
      .status(400)
      .json({ msg: "your response must either be approved ot rejected" });
  }
  const driverObj = await User.findOne({id: driver_id})

  const admin_role = await Role.findOne({ where: { name: "admin" } });
  console.log(role_id, "role id");

  if (admin_role.id === parseInt(role_id)) {
    await User.update(
      {
        documentStatus: doc_new_status,
      },
      {
        where: { id: driver_id },
      }
    );
 notification(driverObj)

    return res
      .status(200)
      .json({ msg: `Driver ${doc_new_status} successfully` });
  }
  return res.status(200).json({ msg: "Error while updating driver" });
};

exports.vehicleDocsForPendingDrivers = async (req, res) => {
  try {
    console.log("Request Parameters:", req.params);
    const role_id = req.params.role_id;
    const driver_id = req.params.driver_id;

    const admin_role = await Role.findOne({ where: { name: "admin" } });

    if (admin_role && admin_role.id === parseInt(role_id)) {
      const driver_vehicle_docs = await Vehicle.findAll({
        where: {
          owner: driver_id,
        },
      });

      if (empty(driver_vehicle_docs)) {
        return res.status(200).json({ msg: "Driver Does not have a Vehicle" });
      }
      return res.status(200).json({
        driver_vehicle_docs: driver_vehicle_docs,
      });
    }

    return res
      .status(400)
      .json({ msg: "You are not authorized for this action" });
  } catch (error) {
    console.error("Error fetching drivers with unverified documents:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.viewAllPendingBooking = async (req, res) => {
  const role_id = req.params.role_id;
  const admin_role = await Role.findOne({ where: { name: "admin" } });

  if (admin_role && admin_role.id === parseInt(role_id)) {
    const pending_request = await Reservation.findAll({
      where: {
        bookingStatus: false,
      },
    });
    if (empty(pending_request)) {
      return res
        .status(200)
        .json({ msg: "No Rservation Available at the moment" });
    }
    return res.status(200).json({ pending_request: pending_request });
  }
};

exports.viewAllReservedVehicles = async (req, res) => {
  try {
    const role_id = req.params.role_id;
    const admin_role = await Role.findOne({ where: { name: "admin" } });

    if (admin_role && admin_role.id === parseInt(role_id)) {
      const pending_requests = await ReservedVehicle.findAll({
        where: { reservationtype: "instant" },
      });

      if (pending_requests.length === 0) {
        return res
          .status(200)
          .json({ msg: "No Reservation Available at the moment" });
      }

      const result = await Promise.all(
        pending_requests.map(async (reservation) => {
          const reservationRecord = await Reservation.findOne({
            where: { id: reservation.reservationId },
            attributes: ["userId", "paymentMode"],
          });

          if (!reservationRecord) {
            return res
              .status(200)
              .json({ msg: "Resevrvation record is empty" });
          }

          const user = await User.findOne({
            where: { id: reservationRecord.userId },
            attributes: ["name", "surname"],
          });

          if (!user) {
            return res.status(200).json({ msg: "user not found " });
          }

          return {
            reservation: reservation,
            user: user,
            reservationRecord: reservationRecord.paymentMode,
          };
        })
      );

      const filteredResult = result.filter((item) => item !== null);

      return res.status(200).json({ pending_requests: filteredResult });
    } else {
      return res
        .status(403)
        .json({ msg: "Access denied. Admin role required." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "An error occurred", error: error.message });
  }
};
//view instant booking
exports.viewAllAdvanceReservedVehicles = async (req, res) => {
  try {
    const role_id = req.params.role_id;
    const admin_role = await Role.findOne({ where: { name: "admin" } });

    if (admin_role && admin_role.id === parseInt(role_id)) {
      const pending_requests = await ReservedVehicle.findAll({
        where: { reservationtype: "advance" },
      });

      if (pending_requests.length === 0) {
        return res
          .status(200)
          .json({ msg: "No Reservation Available at the moment" });
      }

      const result = await Promise.all(
        pending_requests.map(async (reservation) => {
          const reservationRecord = await Reservation.findOne({
            where: { id: reservation.reservationId },
            attributes: ["userId", "paymentMode"],
          });

          if (!reservationRecord) {
            return res
              .status(200)
              .json({ msg: "Resevrvation record is empty" });
          }

          const user = await User.findOne({
            where: { id: reservationRecord.userId },
            attributes: ["name", "surname"],
          });

          if (!user) {
            return res.status(200).json({ msg: "user not found " });
          }

          return {
            reservation: reservation,
            user: user,
            reservationRecord: reservationRecord.paymentMode,
          };
        })
      );

      const filteredResult = result.filter((item) => item !== null);

      return res.status(200).json({ pending_requests: filteredResult });
    } else {
      return res
        .status(403)
        .json({ msg: "Access denied. Admin role required." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "An error occurred", error: error.message });
  }
};
//view advance booking
