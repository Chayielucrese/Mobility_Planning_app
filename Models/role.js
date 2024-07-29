const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const user = require("./user");
// const UserRole = require("./userRole");

const role = sequelize.define(
  "role",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase:true
    },
  },
  { tableName: "role" }
);
// role.belongsToMany(user, {as:"role",through: "UserRole" });
role
  .sync()
  .then(() => {
    console.log("role created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = role;
