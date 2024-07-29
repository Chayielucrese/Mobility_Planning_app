const { empty } = require("php-in-js");
const role = require("../Models/role");
const { where } = require("sequelize");

//create role
exports.createRole = async (req, res) => {
  try {
    var { name } = req.body;
    console.log(name, "name");
    if (empty(name)) {
      return res.status(400).json({ msg: "field name is missing" });
    }
    const role_exist = await role.findOne({ where: { name: name } });
    if (role_exist) {
      return res.status(409).json({ conflict: `role ${name} already exist` });
    }
    if (!(await role.create({ name }))) {
      return res.status(400).json({ err: "fail to save new record" });
    } else {
      return res
        .status(201)
        .json({ success: `role ${name} created successfully` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

//delete role by id

exports.deleteRoleById = async (req, res) => {
  try {
    const role_id = req.params.role_id;
    if (!(await role.destroy({ where: { id: role_id } }))) {
      return res.status(400).json({ badRequest: `fail to delete role` });
    }
    return res.status(400).json({ badRequest: `role deleted successfully` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

//get all role
exports.getAllRole = async (req,res) => {
  try {
    const get_roles = await role.findAll({});
    console.log(get_roles);
    if (empty(get_roles)) {
      return res.status(200).json({ success: "no role found" });
    }
    return res.status(200).json({ success: get_roles });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error"});
  }
};
