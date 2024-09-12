const { DataTypes } = require("sequelize");
const sequelize = require("../DbConfig/db.connect");

const Transaction = sequelize.define("Transaction", {
  phone: { type: DataTypes.STRING(10), allowNull: false },
  ref: { type: DataTypes.STRING(35), allowNull: true },
  amount: { type: DataTypes.FLOAT, allowNull: true },
  fee: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  type: { type: DataTypes.ENUM('credit', 'debit', 'transfert'), allowNull: false },
  status: { type: DataTypes.BOOLEAN, allowNull: false },
  message: { type: DataTypes.STRING(25), allowNull: false },
  operator: { type: DataTypes.STRING(25), allowNull: true },
  reference: { type: DataTypes.STRING(25), allowNull: true },
  operator_trasaction_id: { type: DataTypes.STRING(35), allowNull: true },
  transaction_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  user_agent: { type: DataTypes.STRING, allowNull: true },
  ip_address: { type: DataTypes.STRING(15), allowNull: true },
});
Transaction.sync()
  .then(() => {})
  .catch(() => {});

module.exports = Transaction;
