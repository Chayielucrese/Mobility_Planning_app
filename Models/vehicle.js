const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");

const url = require("../Front_url/image_url_front");


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
      isLowercase: true,
    },
    //in other words vehicle category it could be a car, bike or bus
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
    vehicleRegistrationCertificate: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("vehicleRegistrationCertificate");
        return rawValue
          ? `${url}:9000/Vehicles` + rawValue.replace("\\", "/")
          : null;
      },
      isLowercase: true,
    },
    vehicleInsuranceCertificate: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("vehicleInsuranceCertificate");
        return rawValue
          ? `${url}:9000/Vehicles` + rawValue.replace("\\", "/")
          : null;
      },
      isLowercase: true,
    },
    vehicleSalesCertificate: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("vehicleSalesCertificate");
        return rawValue
          ? `${url}:9000/Vehicles` + rawValue.replace("\\", "/")
          : null;
      },
      isLowercase: true,
    },
    vehicleRoadWorthinessReport: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("vehicleRoadWorthinessReport");
        return rawValue
          ? `${url}:9000/Vehicles` + rawValue.replace("\\", "/")
          : null;
      },
      isLowercase: true,
    },
    bikeFitnessCertificate: {
      type: DataTypes.STRING,
      isLowercase: true,
    },
    // Availability: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: true,
    //   isLowercase: true,
    // },
  },
  { tableName: "vehicle" }
);
// vehicle.belongsToMany(Reservation, {
//   through: ReserveVehicle,
//   as: "reservations",
//   foreignKey: "reservationId",
// });
vehicle
  .sync()
  .then(() => {
    console.log("role created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = vehicle;
