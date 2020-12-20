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
const clustername = "social_media_app"; // "social_media_app"
const uri = `mongodb+srv://${username}:${password}@cluster0.b39jc.mongodb.net/${clustername}?retryWrites=true&w=majority`;

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
        if (data == null) {
            throw {code: 40404, message: "No users found"};
        }
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

// Look up a specific user
router.get("/users/:usr", function(req, res, next) {
    console.log("Get request looking for user: " + req.params.usr);
    UserModel.findOne(
        {username: req.params.usr}
    ).then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "User not found"};
        }
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

// Delete a user
router.get("/users/delete/:usr", function(req, res, next) {
    console.log("Deleting the user with username: " + req.params.usr);
    UserModel.findOneAndDelete(
        {username: req.params.usr},
    ).then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "User not found"};
        }
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

// Update a user
router.get("/users/update/:key", function(req, res, next) {
    console.log("Updating " + req.params.key);
    let queryObj = {};
    if (mongoose.Types.ObjectId.isValid(req.params.key)) {
        queryObj["_id"] = req.params.key;
    } else {
        queryObj["username"] = req.params.key;
    }
    UserModel.findOneAndUpdate(
        queryObj, //Query
        req.body, // Update filter
        {useFindAndModify: false, new: true} //Options
    ).then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "User not found"}
        }
        res.send(data);
    }).catch(function(err) {
        console.log("Error type: " + err.type)
        next(err);
    });
});

// Create a user 
router.get("/users/:usr/:pwd", function(req, res, next) {
    console.log("Creating a user with username: " + req.params.usr + " password: " + req.params.pwd);
    let usrJson = req.body;
    usrJson["username"] = req.params.usr;
    usrJson["password"] = req.params.pwd;
    UserModel.create(usrJson).then(function(data) {
        // This throws an error by itself when there is a duplication
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

/// USERS PART ///

router.get("/posts/:text", function(req, res, next) {
    console.log("Creating a post with text: " + req.params.text);
    PostModel.create({text: req.params.text}).then(function(data) {
        res.send(data);
    }).catch(function(err) {
        console.log(err);
        next(err);
    })
})

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