const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "username is required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        email: {
            type: String
        },
        pp: {
            type: String
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "postModel"
        }],
        connections: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel"
        }],
        topics: [{
            type: String
        }]
    }
);

var PostSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
            unique: false,
            required: [true, "Post needs to have a user"]
        },
        text: {
            type: String
        },
        topics: [{
            type: String
        }],
        likes: {
            type: Number,
            default: 0
        },
        image: {
            type: String
        },
        location: {
            type: String
        }
    }
);

var CommentSchema = new Schema(
    {
        text: {
            type: String
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel"
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "postModel"
        }
    }
);

const User = mongoose.model("userModel", UserSchema);
const Post = mongoose.model("postModel", PostSchema);
const Comment = mongoose.model("commentModel", CommentSchema);

module.exports = [User, Post, Comment];