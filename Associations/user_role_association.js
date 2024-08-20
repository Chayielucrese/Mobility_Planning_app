const User = require('../Models/user');
const Role = require('../Models/role');
const UserRole = require("../Models/userRole");

// Define many-to-many relationships
User.belongsToMany(Role, { through: UserRole, as: 'roles', foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, as: 'users', foreignKey: 'roleId' });


sequelize.sync()
  .then(() => {
    console.log("Models synced successfully");
  })
  .catch((err) => {
    console.log("Failed to sync models", err);
  });
