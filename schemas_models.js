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
            type: String,
            default: ""
        },
        pp: {
            type: String,
            default: "https://i.stack.imgur.com/34AD2.jpg"
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "postModel"
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "commentModel"
        }],
        connections: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel"
        }],
        topics: [{
            type: String
        }],
        locations: [{
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
            type: String,
            default: ""
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "commentModel"
        }],
        topics: [{
            type: String
        }],
        likes: {
            type: Number,
            default: 0
        },
        time: {
            type: Date
        },
        image: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        }
    }
);

var CommentSchema = new Schema(
    {
        text: {
            type: String,
            default: ""
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userModel",
            unique: false
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "postModel",
            unique: false
        },
        time: {
            type: Date
        }
    }
);

const User = mongoose.model("userModel", UserSchema);
const Post = mongoose.model("postModel", PostSchema);
const Comment = mongoose.model("commentModel", CommentSchema);

module.exports = [User, Post, Comment];