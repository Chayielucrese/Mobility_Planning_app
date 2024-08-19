const Ride = require("../Models/rides.");
const { empty } = require("php-in-js");

exports.createRide = async (req, res) => {
  const { name, description } = req.body;

  if (empty(name) || empty(description)) {
    return res.status(400).json({ msg: "enter all required fields" });
  } else {
    await Ride.create({ name, description });
    return res.status(201).json({ msg: "ride created successfully" });
  }
};

exports.getRides = async (req, res) => {
  const getAllRides = await Ride.findAll();
  if (empty(getAllRides)) {
    return res.status(200).json({ msg: "no ride found" });
  }
  return res.status(200).json({ msg: getAllRides });
};
