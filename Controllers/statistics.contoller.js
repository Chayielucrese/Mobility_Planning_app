const { where, Op } = require("sequelize");
const User = require("../Models/user");
const Vehicle = require("../Models/vehicle");
const user = require("../Models/user");
const vehicle = require("../Models/vehicle");

exports.statVehicle = async (req, res) => {
  const user = req.user;
  const total_vehicle = await Vehicle.findAndCountAll({
    where: { owner: user.id },
  });

  return res.status(200).json({ msg: total_vehicle });
};

// exports.DocumentStatus = async (req, res) => {
//   const doc_status = user.documentStatus;
//   return res.status(200).json({ msg: doc_status });
// };
// exports.TotalNmOfVehicles = async (req, res) => {
//   const total_vechicles = await vehicle.findAndCountAll({
//     where: { owner: user.id },
//   });
//   return res.status(200).json({ msg: total_vechicles });
// };

// exports.getAccountStatus = async (req, res) => {
//   const account_status = await user.update({
//     where: { [Op.and]: { documentStatus: "unverified", accountStatus: true, id: user.id } },
//   });
//   if (account_status) {
//     const update_account = await user.findOne();
//   }
// };
