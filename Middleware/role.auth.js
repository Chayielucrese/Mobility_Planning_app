const CheckRole = (role) => async (req, res, next) => {
  const user = req.user;

  console.log(user);
  if (user.role != parseInt(role)) {
    console.log(role, user.role);
    return res
      .status(403)
      .json({ msg: "you are not eligible to this function" });
  }
  next();
};

module.exports = CheckRole;
