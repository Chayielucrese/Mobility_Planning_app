const math = require('mathjs');

module.exports = {
  generatePwdForUser() {
    const pwd = math.randomInt(10000, 100000).toString();
    console.log(pwd);
    return pwd;
  }
};
