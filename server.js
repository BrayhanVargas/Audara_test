const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const bodyParser = require("body-parser");
const routes = require("./routes");
// Creates server
const app = express();
// body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// CORS
app.use(cors());
// Routes
app.use("/api", routes);

module.exports = app;
