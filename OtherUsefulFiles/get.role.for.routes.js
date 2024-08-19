const Role = require('../Models/role')

module.exports = {
   async  getRoleAdmin  () {
        const role = await Role.findOne({ where: { name: "admin" } });
        if (!role) {
          console.log("role not found");
        }
        console.log(role);
        return role;
    }
}