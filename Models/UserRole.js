const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");

const userRole = sequelize.define(
  "UserRole",
  {
    // Add any additional fields here if necessary
  },
  { tableName: "user_role" }
);

userRole
  .sync()
  .then(() => {
    console.log("UserRole model created successfully");
  })
  .catch((err) => {
    console.log("Failed to create UserRole model", err);
  });

module.exports = userRole;
