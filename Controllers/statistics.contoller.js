const { where, Op } = require("sequelize");
const User = require("../Models/user");
const Vehicle = require("../Models/vehicle");
const user = require("../Models/user");
const vehicle = require("../Models/vehicle");
const { empty } = require("php-in-js/modules/types");

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
exports.TotalNmOfVehicles = async (req, res) => {
  try {
    console.log("helloo");
    
    // Assuming `user` object should be retrieved from `req.user` or similar
    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    // Find and count vehicles for the given owner
    const totalVehicles = await Vehicle.count({
      where: { owner: userId },
    });

    console.log(totalVehicles);

    return res.status(200).json({ totalVehicles });
  } catch (error) {
    console.error('Error fetching vehicle count:', error);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

// exports.getAccountStatus = async (req, res) => {
//   const account_status = await user.update({
//     where: { [Op.and]: { documentStatus: "unverified", accountStatus: true, id: user.id } },
//   });
//   if (account_status) {
//     const update_account = await user.findOne();
//   }
// };
