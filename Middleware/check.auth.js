const Secret ="kadkashdharihkfewur8r9erriashfkhdfufuihifhaihifuh";
const jwt = require("jsonwebtoken");

const User = require('../Models/user');

/**authorization */

const authorization = (req, res, next) => {
  if (req.url === "/login" || req.url === "/adminLogin") {
  return  next();
  }
  const authHeader = req.headers["authorization"];
  console.log(authHeader, "authHeader")
  if (!authHeader) return res.sendStatus(403);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, Secret, async (err, decoded) => {
    console.log(err)
    if (err) return res.sendStatus(403); 

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.sendStatus(403);
    }
    req.user = user;
    console.log(req.user)

    next();
  });
  
};
module.exports = authorization;
