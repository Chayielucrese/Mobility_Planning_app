

const User = require('../Models/user')
const Role = require('../Models/role')


exports.getAllDriversWithUnverifiedDocuments = async (req, res) => {
    const role = req.params.role;
    const admin_role = await Role.findOne({ where: { name: "admin" } });
    if (admin_role.id === parseInt(role)) {
      const unverified_drivers = await User.findAll({
        where: { documentStatus: "unverified" },
      });
      if (empty(unverified_drivers)) {
        return res.status(200).json({ msg: "no driver found" });
      }
      return res.status(200).json({ msg: unverified_drivers });
    }
    return res
      .status(400)
      .json({ msg: "your are not eligible to this function" });
  };