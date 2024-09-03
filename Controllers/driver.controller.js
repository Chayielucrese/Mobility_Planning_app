const { empty } = require("php-in-js/modules/types");
const User = require("../Models/user");
const { Op, where } = require("sequelize");

exports.getAllAvailableDrivers = async (req, res) => {
  const drivers_available = await User.findAll({
    where: { [Op.and]: { availability: true, documentStatus: "verified" } },
  });

  if (empty(drivers_available)) {
    return res.status(200).json({ msg: "No driver available at the moment" });
  } else {
    return res.status(200).json({ msg: drivers_available });
  }
};
exports.getDriverDocumentStatus = async (req, res) => {
  const userObj = req.user

  const get_driver = await User.findOne({where: {id: userObj.id}})
  if (empty(get_driver)) {
    return res.status(200).json({ msg: "Driver not found" });
  } else {
    return res.status(200).json({ documentStatus: get_driver.documentStatus });
  }
};
