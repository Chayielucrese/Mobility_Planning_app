const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const { isLowercase } = require("validator");

// Define the Role model
const Reservationtypes = sequelize.define("ReservationTypes", {
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
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  terms: {
    type: DataTypes.STRING,
  },

  reconmendation: {
    type: DataTypes.STRING,
    // allowNull: false,
    isLowercase: true,
  },
});

Reservationtypes.sync()
  .then(() => {
    // console.log("Reservationtypes created successfully");
  })
  .catch((err) => {
    console.log("Reservationtypes to create model", err);
  });

module.exports = Reservationtypes;
