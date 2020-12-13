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
console.log(username + " " + password);
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

router.get("/users", function(req, res) {
    console.log("user get request");
    UserModel.findOne({username: req.body.username}).then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.log(err);
    });
});

router.post("/users", function(req, res) {
    console.log("user post request");
    UserModel.create(req.body).then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.log(err);
    });
});

router.delete("/users", function(req, res) {
    console.log("user delete request");
    UserModel.findOneAndDelete({username: req.body.username}).then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.log(err);
    });
});

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