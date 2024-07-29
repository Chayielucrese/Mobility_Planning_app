const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const role = require("./role");
const { key } = require("php-in-js/modules/array");
const { isLowercase } = require("validator");
// const UserRole = require("./userRole");

const user = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase:true
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase:true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase:true
    },
    userCode:{
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    accountStatus: {
      type: DataTypes.BOOLEAN,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
      isLowercase:true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase:true
    },
    preferedPaymentMode: {
      type: DataTypes.ENUM("om", "momo", "cash", "wallet"),
      isLowercase:true
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    documentStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
    profileImage: {
      type: DataTypes.STRING,
      
    },
    walletBalance: {
      type: DataTypes.INTEGER,

      defaultValue: 0,
      walletStatus: {
        type: DataTypes.STRING,
        defaultValue: "empty",
      },
    },
    CNI: {
      type: DataTypes.STRING,
    },
    vehicleReg:{
      type: DataTypes.STRING,
    },
    vehiclePhoto:{
      type: DataTypes.STRING,
    },
    drivingLicense: {
      type: DataTypes.STRING,
    },
    numberOfCompleRide: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    salaryStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    appFee: {
      type: DataTypes.DECIMAL,
    },
  },
  { tableName: "user" }
);

// user.belongsToMany(user, { as: "user", through: "UserRole" });

user
  .sync()
  .then((result) => {
    console.log("model created sccessfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = user;
