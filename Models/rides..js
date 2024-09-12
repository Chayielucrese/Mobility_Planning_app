const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const { isLowercase } = require("validator");

// Define the Role model
const Ride = sequelize.define(
  "Ride",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
  },

);

Ride.sync()
  .then(() => {
    // console.log("ride created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });

module.exports = Ride;
