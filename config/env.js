const env = process.env.NODE_ENV || 'development'
const ip = require('ip')

const port = process.env.PORT || 9000, 
    myIP = ip.address()
    console.log(myIP , "myIP");
    

let baseUrl = `http://${myIP}:${port}`

module.exports = {
    host: process.env.HOST || "127.0.0.1",
    port,
    baseUrl,

}