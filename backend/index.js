const express = require("express");
const app = express();
const bodyparser= require("body-parser");
const route = require("./models/control");
const connection = require("./models/connection");
const dotenv = require("dotenv");
var morgan = require('morgan');
var cors = require('cors')
app.use(cors()) // Use this after the variable declaration
app.use(express.json());
app.use("/",route);
dotenv.config();
//app.use(bodyparser.urlencoded({ extended: false }));
app.listen(3011, "0.0.0.0",() => {
  console.log('server started');
});
