const { empty } = require("php-in-js/modules/types");
const Vehicle = require("../Models/vehicle");
const VehicleOwnerUpload = require("../OtherUsefulFiles/vehicle.document.upload");
const { where, Op } = require("sequelize");
const user = require("../Models/user");
const { mode } = require("mathjs");
const uploadDocument = require("../OtherUsefulFiles/upload.document");

exports.createVehicle = async (req, res) => {
  try {
    const {
      plateNumber,
      vehicleModel,
      vehicleType,
      vehicleMark,
      vehicleRegCert,
      vehicleInsurCert,
      vehicleRoadWthRep,
      vehicleSalescert,
    } = req.body;
    const user = req.user;

    if (
      empty(plateNumber) ||
      empty(vehicleModel) ||
      empty(vehicleType) ||
      empty(vehicleMark) ||
      empty(vehicleInsurCert) ||
      empty(vehicleRegCert) ||
      empty(vehicleRoadWthRep || empty(vehicleSalescert))
    ) {
      console.log("vehicleMark", vehicleMark);

      return res.status(400).json({ msg: "fill all required fields" });
    }

    if (!["car", "motobike", "bus"].includes(vehicleType)) {
      console.log(vehicleType, vehicleModel, "vehicleType");

      return res.status(400).json({
        msg: "vehicle must correspond to existing types: car, motobike or bus",
      });
    }
    if (!(await Vehicle.findOne({ where: { owner: user.id } }))) {
      const platnum_found = await Vehicle.findOne({ where: { plateNumber } });
      if (platnum_found) {
        return res.status(409).json({ msg: "This Vehicle already exist" });
      } else {
        const create_new_cab = await Vehicle.create({
          plateNumber,
          vehicleType: vehicleType,
          vehicleModel,
          owner: user.id,
          vehicleMark,
        });
        if (!create_new_cab) {
          return res
            .status(400)
            .json({ msg: "an error occured while adding vehicle" });
        }
        VehicleOwnerUpload(
          user,
          vehicleInsurCert,
          vehicleSalescert,
          vehicleRoadWthRep,
          vehicleRegCert
        );if(!VehicleOwnerUpload){
          return res.status(400).json({ msg: "Fail to upload vehicle documents" });
        }
        return res.status(201).json({ msg: "You Added a vehicle" });
      }
    } else {
      return res.status(201).json({ msg: "You already have a vehicle" });
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
      vehicleMark: get_vehicle.vehicleMark,
      plateNumber: get_vehicle.plateNumber,
      vehicleModel: get_vehicle.model,
      vehicleType: get_vehicle.vehicleType,
    },
  });
};

//view all existing vehicles
exports.getAllVehicles = async (req, res) => {
  const user = req.user;
  const get_all_his_cabs = await Vehicle.findAll({
    where: { owner: user.id },
  });
  if (empty(get_all_his_cabs)) {
    return res.status(200).json({ msg: get_all_his_cabs });
  }
  console.log(get_all_his_cabs, "get_all_his_cabs");
  console.log("all vehicles", get_all_his_cabs);

  return res.status(200).json({ msg: get_all_his_cabs });
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

//edit profile

