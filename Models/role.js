const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");

// Define the Role model
const Role = sequelize.define(
  "Role",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
  },
  { tableName: "role" }
);


Role
  .sync()
  .then(() => {
    console.log("role created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });

module.exports = Role;
