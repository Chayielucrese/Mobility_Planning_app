const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const User = require('../Models/user')
const Role = require('../Models/role')

// Define the UserRole model
const UserRole = sequelize.define(
  "UserRole",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id'
      }
    }
  },

);
UserRole
  .sync()
  .then(() => {
    // console.log("UserRole created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = UserRole;
