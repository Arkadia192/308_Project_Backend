const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var PostSchema;
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
        pp: {
            type: String
        },
        posts: {
            type: [PostSchema]
        },
        connections: {
            type: [String]
        }
    }
);

var PostSchema = new Schema(
    {
        user: {
            type: UserSchema,
            required: [true, "Post needs to have a user"]
        },
        text: {
            type: String
        },
        topics: {
            type: [String]
        },
        likes: {
            type: Number
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
            type: UserSchema
        },
        posts: {
            type: PostSchema
        }
    }
);

const User = mongoose.model("userModel", UserSchema);
const Post = mongoose.model("postModel", PostSchema);
const Comment = mongoose.model("commentModel", CommentSchema);

module.exports = [User, Post, Comment];