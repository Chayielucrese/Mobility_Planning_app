const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const sequelize = require("./DbConfig/db.connect");
const path = require("path");
const cors = require('cors');',,,,,,,,,,,,,,,,,'
//importing my database connection
require("./DbConfig/db.connect");

app.use(
  bodyparser.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.use('/profileImages', express.static(path.join(__dirname, "profileImages")))
app.use('/Vehicles', express.static(path.join(__dirname, "Vehicles")))
app.use('/Uploads', express.static(path.join(__dirname, "Uploads")))
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
    limit: "50mb",
  })
);

app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Authorization, Content-Type",
  credentials: true,
}));


//dealing with static files
app.use(express.static(path.join(__dirname, "client")));

app.use("/api", require("./Routes/role.route.js/index"));
app.use("/api", require("./Routes/user.routes.js/index"));
app.use("/api", require("./Routes/admin.routes"));
app.use('/api', require('./Routes/vehicle.routes'))
app.use('/api', require('./Routes/statistics.routes'));
app.use('/api', require('./Routes/ride.routes'));
app.use('/api', require('./Routes/driver.routes'));
app.use('/api', require('./Routes/wallet.routes'));



const port = 9000 || process.env.port;
app.listen(9000, () => {
  console.log(`server is listening on port ${port}`);
});
