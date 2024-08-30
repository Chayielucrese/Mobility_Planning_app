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
});
UserSubscription.sync()
  .then(() => {
    console.log("UserSubscription model  created successfully");
  })
  .catch((err) => {
    console.log("fail to create model", err);
  });
module.exports = UserSubscription;
