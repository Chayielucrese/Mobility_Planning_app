const { empty } = require("php-in-js/modules/types");
const Vehicle = require("../Models/vehicle");
const VehicleOwnerUpload = require("../OtherUsefulFiles/simple.image.upload");
const { where, Op } = require("sequelize");
const user = require("../Models/user");

exports.createVehicle = async (req, res) => {
  try {
    const { plateNumber, model, userPhoto, vehicleType } = req.body;
    const user = req.user;

    if (empty(plateNumber) || empty(model) || empty(vehicleType)) {
      return res.status(400).json({ msg: "fill all required fields" });
    }
    if (empty(userPhoto)) {
      return res
        .status(400)
        .json({ msg: "please upload a photo of you before submiting" });
    }
    if (!["car", "motobike", "bus"].includes(vehicleType)) {
      return res.status(400).json({
        msg: "vehicle must correspond to existing types: car, motobike or bus",
      });
    }
    const platnum_found = await Vehicle.findOne({ where: { plateNumber } });
    if (platnum_found) {
      return res.status(409).json({ msg: "This Vehicle already exist" });
    } else {
      const create_new_cab = await Vehicle.create({
        plateNumber,
        vehicleType,
        vehicleModel: model,
        owner: user.id,
      });
      if (!create_new_cab) {
        return res
          .status(400)
          .json({ msg: "an error occured while adding vehicle" });
      }
      VehicleOwnerUpload(userPhoto, user);
      return res.status(201).json({ msg: "vehicle created successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "internal server error" });
  }
};

//view vehicle details
exports.viewVehicleDetails = async (req, res) => {
  const vehicle = req.params.vehicle;
  const user = req.user;
  const get_vehicle = await Vehicle.findOne({
    where: { [Op.and]: [{ owner: user.id, id: vehicle }] },
  });
  if (empty(get_vehicle)) {
    return res.status(200).json({ msg: "no match" });
  }
  return res.status(200).json({
    msg: {
      owner: get_vehicle.owner,
      userPhoto: get_vehicle.userPhoto,
      plateNumber: get_vehicle.plateNumber,
      vehicleModel: get_vehicle.model,
      vehicleType: get_vehicle.vehicleType,
    },
  });
};

//view all existing vehicles
exports.getAllVehicles = async (req, res) => {
  const user = req.user;
  const gell_all_his_cabs = await Vehicle.findAll({
    where: { owner: user.id },
  });
  if (empty(gell_all_his_cabs)) {
    return res.status(200).json({ msg: "No vehicle found" });
  }
  return res.status(200).json({ msg: gell_all_his_cabs });
};

//delete vehicle by id
exports.deleteVehicle = async (req, res) => {
  const vehicle = req.params.vehicle;
  const user = req.user;
  const he_has_vehicle = await Vehicle.findOne({ where: { owner: user.id } });
  if (he_has_vehicle) {
    await Vehicle.destroy({
      where: { [Op.and]: [{ owner: user.id, id: vehicle }] },
    });
    return res.status(200).json({ msg: "vehicle deleted" });
  }
  return res.status(200).json({ msg: "no vehicle matches you" });
};
