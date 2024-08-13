const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const user = require("./user");
const { isLowercase } = require("validator");

const vehicle = sequelize.define(
  "vehicle",
  {
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxNumberofSeats: {
      type: DataTypes.INTEGER,
    },
    rideStatus: {
      type: DataTypes.STRING,

      isLowercase: true,
    },
    numofSeatsLeft: {
      type: DataTypes.INTEGER,
    },
    owner: {
      type: DataTypes.INTEGER,
    },
    userPhoto: {
      type: DataTypes.STRING,
    },

    serviceCategory: {
      type: DataTypes.ENUM(""),

      isLowercase: true,
    },
    agency: {
      type: DataTypes.STRING,

      isLowercase: true,
    },
    vehicleModel: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
    vehicleMark: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //in other words vehicle category it could be a car, bike or bus
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
    vehicleRegistrationCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleInsuranceCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleSalesCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleRoadWorthinessReport: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "vehicle" }
);

vehicle
  .sync()
  .then(() => {
    console.log("role created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = vehicle;
