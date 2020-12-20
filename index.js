const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

app.use("/api", require("./api"));

//Error handling
app.use(function(err, req, res, next) {
    res.status(500);
    if (err.code == 11000) {
        console.log("Duplicate key error received");
        res.send({error: "DUPLICATE", message: "This user already exists"});
    }
    else if (err.code == 40404) {
        console.log("Database returned null");
        res.send({error: "EMPTY", message: err.message});
    }
    else {
        console.log(err);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        res.send("Please contact the server owner and tell them to handle the error: " + err);
    }
});

app.listen(process.env.PORT || 4000, function() {
    console.log("listening...");
});
