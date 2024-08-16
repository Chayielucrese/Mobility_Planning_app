const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");

// Define the UserRole model
const UserRole = sequelize.define(
  "UserRole",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'id'
      }
    }
  },
  { tableName: "user_role" }
);

module.exports = UserRole;
