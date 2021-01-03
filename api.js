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

const GetUserQuery = function(key) {
    if (mongoose.Types.ObjectId.isValid(key))
        return {_id: key};
    return {username: key};
}

/// USERS PART BEGIN ///

// Get all users
router.get("/users", function(req, res, next) {
    console.log("Get all users request");
    UserModel.find().populate("posts").populate("connections").then(function(data) {
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
    let userQuery = GetUserQuery(req.params.usr);
    UserModel.findOne(userQuery).populate("posts").populate("connections").then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "User not found"};
        }
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

// Delete a user
router.delete("/users/delete/:usr", function(req, res, next) {
    console.log("Deleting the user: " + req.params.usr);
    let userQuery = GetUserQuery(req.params.usr);
    UserModel.findOneAndDelete(userQuery).then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "User not found"};
        }
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

// Update a user
router.put("/users/update/:usr", function(req, res, next) {
    console.log("Updating the user: " + req.params.usr);
    let userQuery = GetUserQuery(req.params.usr);
    UserModel.findOneAndUpdate(
        userQuery, //Query
        req.body, // Update filter
        {useFindAndModify: false, new: true} //Options
    ).then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "User not found"}
        }
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

// Add Connection to a user
router.post("/users/:target/:toAdd", function(req, res, next) {
    console.log("Connecting " + req.params.target + " to " + req.params.toAdd);
    let targetQuery = GetUserQuery(req.params.target);
    let toAddQuery = GetUserQuery(req.params.toAdd);
    UserModel.findOne(targetQuery).then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "User not found"};
        }
        UserModel.findOne(toAddQuery).then(function(data2) {
            if (data2 == null) {
                throw {code: 40404, message: "User not found"};
            }
            data.connections.push(data2._id);
            data.save().then(function(data3) {
                res.send(data);
            }).catch(function(err) {
                next(err);
            });
        }).catch(function(err) {
            next(err);
        });
    }).catch(function(err) {
        next(err);
    })
})

// Create a user 
router.post("/users", function(req, res, next) {
    console.log("Creating a user with username: " + req.body.usr + " password: " + req.body.pwd);
    let usrJson = req.body;
    UserModel.create(usrJson).then(function(data) {
        // This throws an error by itself when there is a duplication
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

/// USERS PART END ///

/// POSTS PART BEGIN ///

// Get all posts
router.get("/posts", function(req, res, next) {
    console.log("Getting all posts");
    PostModel.find().populate("user").then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "No posts found"};
        }
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

// Get all posts of a user
router.get("/posts/:user", function(req, res, next) {
    console.log("Getting posts of: " + req.params.user);
    let userQuery = GetUserQuery(req.params.user);
    UserModel.findOne(userQuery).populate("posts").then(function(userData) {
        if (userData == null) {
            throw {code: 40404, message: "User not found"};
        }
        res.send(userData.posts);
    }).catch(function(err) {
        next(err);
    });
});

// Post something
router.post("/posts/:user", function(req, res, next) {
    console.log(req.params.user + " is posting something");
    let userQuery = GetUserQuery(req.params.user);
    let postJson = req.body;
    //let postJson = {};
    UserModel.findOne(userQuery).then(function(userData) {
        if (userData == null) {
            throw {code: 40404, message: "User not found"};
        }
        postJson["user"] = userData._id;
        PostModel.create(postJson).then(function(postData) {
            userData.posts.push(postData._id);
            userData.save().then(function(data3) {
                res.send(postData);
            }).catch(function(err) {
                next(err);
            });
        }).catch(function(err) {
            next(err);
        });
    }).catch(function(err) {
        next(err);
    });
});

// Delete a post
router.delete("/posts/:postId", function(req, res, next) {
    console.log("Deleting the post with id: " + req.params.postId);
    if (!mongoose.Types.ObjectId.isValid(req.params.postId))
        next({message: "Id is invalid"});
    PostModel.deleteOne({_id: req.params.postId}).then(function(postData) {
        if (postData == null) {
            throw {code: 40404, message: "Post not found"};
        }
        res.send(postData);
    }).catch(function(err) {
        next(err);
    });
});

// Update a post
router.put("/posts/:postId", function(req, res, next) {
    console.log("Updating the post with id: " + req.params.postId);
    if (!mongoose.Types.ObjectId.isValid(req.params.postId))
        next({message: "Id is invalid"});
    PostModel.findOneAndUpdate({"_id": req.params.postId}, req.body, {useFindAndModify: false, new: true}).then(function(postData){
        if (postData == null) {
            throw {code: 40404, message: "Post not found"};
        }
        res.send(postData);
    }).catch(function(err) {
        next(err);
    });
})

// Like a post
router.put("/posts/like/:postId", function(req, res, next) {
    console.log("Liking the post with id: " + req.params.postId);
    if (!mongoose.Types.ObjectId.isValid(req.params.postId))
        next({message: "Id is invalid"});
    PostModel.findOne({_id: req.params.postId}).then(function(postData) {
        if (postData == null) {
            throw {code: 40404, message: "Post not found"};
        }
        postData.likes += 1;
        postData.save().then(function(data) {
            res.send(data);
        }).catch(function(err) {
            next(err);
        });
    }).catch(function(err) {
        next(err);
    });
});

/// POSTS PART END ///


// Get data
router.get("/stuff", function(req, res) {
    console.log("GET request");
    res.send({type: "GET"});
});

// Send data 
router.post("/stuff", function(req, res) {
    console.log("POST request");
    res.send({type: "POST"});
});

// Update Data
router.put("/stuff", function(req, res) {
    console.log("PUT request");
    res.send({type: "PUT"});
});

// Delete data
router.delete("/stuff", function(req, res) {
    console.log("DELETE request");
    res.send({type: "DELETE"});
});

module.exports = router;