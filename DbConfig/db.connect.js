const Sequelize = require("sequelize");
const { Db_name, Db_password, username, Host, Port } = require("./db.params");


const sequelize = new Sequelize(`mysql://root:@${Host}:${Port}/${Db_name}`);
sequelize
  .sync()
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log("fail to connect to database", err);
  });
module.exports = sequelize