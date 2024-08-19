const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");

// Define the User model
const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
    userCode: {
      type: DataTypes.STRING,
    },
    accountActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      isLowercase: true,
    },
    preferedPaymentMode: {
      type: DataTypes.ENUM("om", "momo", "cash", "wallet"),
      isLowercase: true,
    },
    documentStatus: {
      type: DataTypes.ENUM("accepted", "rejected", "unverified"),
      defaultValue: "unverified",
      isLowercase: true,
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    walletBalance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    phone: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    CNI: {
      type: DataTypes.STRING,
    },
    vehicleReg: {
      type: DataTypes.STRING,
    },
    agencyRegNumber: {
      type: DataTypes.STRING,
    },
    agencyBusStation: {
      type: DataTypes.STRING,
    },
    agencyProofOfAddress: {
      type: DataTypes.STRING,
    },
    agencyTaxIdentificationNumber: {
      type: DataTypes.STRING,
    },
    agencyOwner: {
      type: DataTypes.STRING,
    },
    agencycompanyLogo: {
      type: DataTypes.STRING,
    },
    agencyBusinessLicense: {
      type: DataTypes.STRING,
    },
    agencyBusinessRegistrationCertificate: {
      type: DataTypes.STRING,
    },
    vehiclePhoto: {
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

User
  .sync()
  .then(() => {
    console.log("role created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });

module.exports = User;
