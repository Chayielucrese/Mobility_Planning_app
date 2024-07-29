const jwt = require("jsonwebtoken");

 const Secret = "kadkashdharihkfewur8r9erriashfkhdfufuihifhaihifuh";
const link_expireIn = "12h";

module.exports = {
  generateTokenForUSer(userId, userRole) {

    const token = jwt.sign({ id: userId , Role:userRole}, Secret, {
      expiresIn: link_expireIn,
    });
    return { token: token};
  },

  generateAdminToken(userRole){
    const token = jwt.sign({ Role: userRole }, Secret, {
      expiresIn: link_expireIn,
    });
    return { token: token};
  },

  parseAuthorization: (authorization) => {
    return authorization != null ? authorization.replace("bearer " + "") : null;
  },
  
 
};
