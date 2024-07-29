// const sequelize = require("../DbConfig/db.connect");
// const role = require("./role");
// const user = require("./user");

// const UserRole = sequelize.define("UserRole",{timestamps: false})
// // user.belongsToMany(user, {through:UserRole})
// // role.belongsToMany(role, {through:UserRole})

// UserRole.sync().then(()=>{
//     console.log("userrole created successfully");
// }).catch((err)=>{
//     console.log("fail to create model", err);
// })
// module.exports = UserRole