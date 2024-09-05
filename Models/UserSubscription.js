const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");
const User = require("./user");
const Subscription = require("./reservationtypes");

const UserSubscription = sequelize.define("Subcription", {
  subscriptionId: {
    type: DataTypes.INTEGER,
    references: {
      model: Subscription,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  paymentMode: { type: DataTypes.ENUM("wallet", "cash") },
  paymentStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
  duration: { type: DataTypes.INTEGER },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
});
UserSubscription.sync()
  .then(() => {
    console.log("UserSubscription model  created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = UserSubscription;
