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
    console.log("Creating a user with username: " + req.body.username + " password: " + req.body.password);
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
    PostModel.find().populate("user").populate("comments").then(function(data) {
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
    UserModel.findOne(userQuery).populate({path: "posts", populate: {path: "comments"}}).then(function(userData) {
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
        postJson["time"] = Date.now();
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

///////// Likes

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

//////// Topics

// Add a topic to a post
router.put("/topics", function(req, res, next) {
    console.log("adding topic to post with id: " + req.body.id);
    if (!mongoose.Types.ObjectId.isValid(req.body.id))
        next({message: "Id is invalid"});
    PostModel.findOne({_id: req.body.id}).then(function(postData) {
        postData.topics.push(req.body.topic);
        postData.save().then(function(newPostData) {
            res.send(newPostData);
        }).catch(function(err) {
            next(err);
        });
    }).catch(function(err) {
        next(err);
    });
});

// Get all posts with a spesific topic
router.get("/topics", function(req, res, next) {
    console.log("Getting all posts with topic: " + req.body.topic);
    PostModel.find({topics: req.body.topic}).then(function(data) {
        if (data == null) {
            throw {code: 40404, message: "No posts with this topic"};
        }
        res.send(data);
    }).catch(function(err) {
        next(err);
    });
});

// Remove a topic from a post
router.delete("/topics", function(req, res, next) {
    console.log("Removing " + req.body.topic + " from the post with id: " + req.body.id);
    PostModel.findOne({_id: req.body.id}).then(function(postData) {
        postData.topics.pull(req.body.topic);
        postData.save().then(function(newPostData) {
            res.send(newPostData);
        });
    }).catch(function(err) {
        next(err);
    });
});

/// POSTS PART END ///

/// COMMENTS PART START ///

// Get a comment
router.get("/comments", function(req, res, next) {
    console.log("Getting the comment with id: " + req.body.id);
    if (!mongoose.Types.ObjectId.isValid(req.body.id))
        next({message: "Comment id is invalid"});
    CommentModel.findOne({_id: req.body.id}).populate("user").populate("post").then(function(commentData) {
        if (commentData == null) {
            throw {code: 40404, message: "comment not found"};
        }
        res.send(commentData);
    }).catch(function(err) {
        next(err);
    });
});

// Add a comment to a post
router.post("/comments", function(req, res, next) {
    console.log("Adding a comment to post with id: " + req.body.post);
    if (!mongoose.Types.ObjectId.isValid(req.body.post))
        next({message: "Post id is invalid"});
    let userQuery = GetUserQuery(req.body.user);
    UserModel.findOne(userQuery).then(function(userData) {
        PostModel.findOne({_id: req.body.post}).then(function(postData) {
            let commentQuery = {text: req.body.text, 
                                user: userData._id, 
                                post: postData._id,
                                time: Date.now()};
            CommentModel.create(commentQuery).then(function(commentData) {
                userData.comments.push(commentData._id);
                userData.save().then(function(savedUser) {
                    postData.comments.push(commentData._id);
                    postData.save().then(function(savedPost) {
                        res.send(commentData);
                    }).catch(function(err) {
                        next(err);
                    });
                }).catch(function(err) {
                    next(err);
                });
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

// Delete a comment 
router.delete("/comments", function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.body.id))
        next({message: "Comment id is wrong"});
    CommentModel.findOneAndDelete({_id: req.body.id}).then(function(commentData) {
        if (commentData == null) {
            throw {code: 40404, message: "User not found"};
        }
        res.send(commentData);
    }).catch(function(err) {
        next(err);
    });
});

/// COMMENTS PART END ///

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