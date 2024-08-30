const User = require("../Models/user");
const Role = require("../Models/role");

exports.getAllDriversWithUnverifiedDocuments = async (req, res) => {
  const role = req.params.role;
  const admin_role = await Role.findOne({ where: { name: "admin" } });
  if (admin_role.id === parseInt(role)) {
    const unverified_drivers = await User.findAll({
      where: { documentStatus: "unverified" },
    });
    if (empty(unverified_drivers)) {
      return res.status(200).json({ msg: "No Pending Driver" });
    }
    return res.status(200).json({ msg: unverified_drivers });
  }
  return res
    .status(400)
    .json({ msg: "your are not eligible to this function" });
};

exports.updateDucmentStatus = async (req, res) => {
  const user = req.user;
  const role = req.params.role;
  const driver_id = req.params.driver_id;
  const valid_update_options = ["approved", "rejected"];
  const admin_role = await Role.findOne({ where: { name: "admin" } });
  if (admin_role.id === parseInt(role)) {
    const update_driver = await User.update(
      {
        documentStatus: valid_update_options.includes[("approved", "rejected")],
      },
      {
        where: { id: driver_id },
      }
    );
  }
};
