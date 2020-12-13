const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use("/api", require("./api"));

app.listen(process.env.PORT || 4000, function() {
    console.log("listening...");
});
