const express = require("express");
const dotenv = require("dotenv").config();
const router = express.Router();
const mongoose = require("mongoose");
const schemas = require("./schemas_models");

const UserModel = schemas[0];
const PostModel = schemas[1];
const CommentModel = schemas[2];

const username = process.env.USERNAME_cli;
const password = process.env.PASSWORD_cli;
const uri = `mongodb+srv://${username}:${password}@cluster0.b39jc.mongodb.net/social_media_app?retryWrites=true&w=majority`;

const settings = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
};

mongoose.connect(uri, settings);
mongoose.Promise = global.Promise;

mongoose.connection.once("open", () => {
    console.log("Connected");
}).on("error", (err) => {
    console.log("ERROR: " + err);
});

/// USERS PART ///


// Get all users
router.get("/users", function(req, res, next) {
    console.log("Get all users request");
    UserModel.find().then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.log(err);
        next();
    });
});

// Look up a specific user
router.get("/users/:usr", function(req, res, next) {
    console.log("Get request looking for user: " + req.params.usr);
    UserModel.findOne({username: req.params.usr}).then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.log(err);
        next();
    });
});

// Delete a user
router.get("/users/delete/:usr", function(req, res, next) {
    console.log("Deleting the user with username: " + req.params.usr);
    UserModel.findOneAndDelete({username: req.params.usr}).then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.log(err);
        next();
    });
});

// Create a user 
router.get("/users/:usr/:pwd", function(req, res, next) {
    console.log("Creating a user with username: " + req.params.usr + " password: " + req.params.pwd);
    let usrJson = req.body;
    usrJson["username"] = req.params.usr;
    usrJson["password"] = req.params.pwd;
    UserModel.create(usrJson).then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.log(err);
        next();
    });
});

/// USERS PART ///

router.get("/stuff", function(req, res) {
    console.log("GET request");
    res.send({type: "GET"});
});

router.post("/stuff", function(req, res) {
    console.log("POST request");
    res.send({type: "POST"});
});

router.put("/stuff", function(req, res) {
    console.log("PUT request");
    res.send({type: "PUT"});
});

router.delete("/stuff", function(req, res) {
    console.log("DELETE request");
    res.send({type: "DELETE"});
});

module.exports = router;