
const math = require('mathjs')
module.exports={
 generatePwdForUser(){
    const pwd = math.random().toString(36).slice(-8)
    return pwd
}
}