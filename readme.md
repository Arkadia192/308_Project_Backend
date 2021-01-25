## <b>There are functions that are not documented here since we started using postman to share functions between us. I just wanted to make that clear in case you just check this readme to grade the backend :).</b>

# Social Media Project

# Users:

```
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
        }]
    }
);
```
Standard error scheme:
```
{
    error: "STRING", // either "DUPLICATE" or "EMPTY"
    message: "a message for you"
}
```
Response code will be 500 if you get an error

- ## Main Route -> http://project-308.herokuapp.com/api/users

The requests are now following the REST standarts and we can not handle everything with GET requests. You will need to send the correct request to the correct endpoint containing the correctly formatted JSON data to successfully use the database.

## There are 6 functions regarding users:

### <b>Get all users</b> [GET]:
usage: 
- Send an empty <b>GET</b> request to the [main route](http://project-308.herokuapp.com/api/users). 
- Returns a comma seperated list of JSON objects of type USER.

failstate:
- If there are no users to be found, response code is 500, error is "EMPTY".

### <b>Get a single user</b> [GET]:
usage:
- Send an empty <b>GET</b> request to `/name` on top of the main route. (ex: http://project-308.herokuapp.com/api/users/berk)
- `name` is the username of the user you want. Optionally, you can also pass the _id of the user.
- Returns the user you want as a JSON object.

failstate:
- If the user can't be found, responce code is 500, error is "EMPTY".

### <b>Create a user</b> [POST]:
usage:
- Send a <b>POST</b> request to the main route. (ex: http://project-308.herokuapp.com/api/users)
- The request body needs to have a JSON object with `username` and `password`. Other parameters of the user can be added to the body but these two are required.
- The body should look like `{"username": "berk", "password": "123123", ...}` where `...` can be empty or other parameters of the user.
- Returns the fresh user as a JSON object.

failstate:
- Since the username is a key value in the database, if you try to create an already existing user, response code is 500 and error is "DUPLICATE".

### <b>Delete a user</b> [DELETE]:
usage:
- Send an empty <b>DELETE</b> request to `/delete/name` on top of the main route. (ex: http://project-308.herokuapp.com/api/users/delete/berk)
- `name` is the username of who you want to delete. Optionally, you can also pass the _id of the user.
- Returns the deleted user as a JSON object.

failstate:
- If the user with the `name` can not be found, response code is 500, error is "EMPTY"

### <b>Update a user</b> [PUT]:
usage:
- Send a <b>PUT</b> request to `/update/user` on top of the main route (ex: http://project-308.herokuapp.com/api/users/update/5fda118d4e74f60017e52fb2 or http://project-308.herokuapp.com/api/users/update/berk)
- `user` is either the _id attribute of the user or the username attribute of the user.
- Give the attributes you want to change in the <b>body</b> of the request. (ex: update password -> `{password: "123456"}`)

failstate:
- If the user with the given _id or username can not be found, response code is 500, error is "EMPTY"
- Since there are many ways for this function to fail, not everything was suitable to handle in the server. Be careful about which attributes you are trying to change since if you try to change an attribute that doesn't exist, you will get an error with response code 200 (OK).

### <b>Connect Users</b> [POST]:
usage:
- Send an empty <b>POST</b> request to `/target/toAdd` on top of the main route (ex: http://project-308.herokuapp.com/api/users/berk/berkay)
- `target` and `toAdd` both can be either the username attributes or _id's.
- It adds `toAdd` as a connection to `target`. `target` follows `toAdd` after the operation.
- Returns the `target` user after successful operation.

failstate:
- If any of the users can not be found, response code is 500, error is "EMPTY"

# POSTS:

```
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
```

- ## Main Route -> http://project-308.herokuapp.com/api/posts

## There are 6 functions regarding posts:

### <b>Get all posts</b> [GET]:
usage: 
- Send an empty <b>GET</b> request to the [main route](http://project-308.herokuapp.com/api/posts). 
- Returns a comma seperated list of JSON objects of type POST.

failstate:
- If there are no posts to be found, response code is 500, error is "EMPTY".

### <b>Get all posts of a user</b> [GET]:
usage:
- Send an empty <b>GET</b> request to `/user` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/berk)
- `/user` can be username or _id.
- Returns a comma seperated list of JSON objects of type POST.

failstate:
- If there are no posts to be found, response code is 500, error is "EMPTY".
- If the user can not be found, response code is 500, error is "EMPTY".

### <b>Create a post</b> [POST]:
usage:
- Send a <b>POST</b> request to `/user` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/berk)
- `/user` can be username or _id.
- All the parameters of the post should be given in the body of the request in JSON format. (ex: `{"text": "asdasd"}`)

failstate:
- If the user can not be found, response code is 500, error is "EMPTY".

### <b>Delete a post</b> [DELETE]:
usage:
- Send an empty <b>DELETE</b> request to `/postID` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/5ff1e1a91e2c5e49f42af0ca)
- `PostID` is the _id attribute of the post.

failstate:
- If the post can not be found, response code is 500, error is "EMPTY".
- If the `PostID` is invalid, responce code is 500, message is "Id is invalid".

### <b>Update a post</b> [PUT]:
usage:
- Send a <b>PUT</b> request to `/postID` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/5ff1e1a91e2c5e49f42af0ca)
- `PostID` is the _id attribute of the post.
- Place every attribute you want to change in the body of the request. (ex: `{"text": newText}`)

failstate:
- If the post can not be found, response code is 500, error is "EMPTY".
- If the `PostID` is invalid, responce code is 500, message is "Id is invalid".

### <b>Like a post</b> [PUT]:
usage:
- Send an empty <b>PUT</b> request to `/like/postID` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/like/5ff1e1a91e2c5e49f42af0ca)
- `PostID` is the _id attribute of the post.
- If the request can be processed without any errors, like count is increased by 1.

failstate:
- If the post can not be found, response code is 500, error is "EMPTY".
- If the `PostID` is invalid, responce code is 500, message is "Id is invalid".

# COMMENTS:

```
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
```

- ## Main Route -> http://project-308.herokuapp.com/api/comments

## There are 3 functions regarding comments:

### <b>Get a comment</b> [GET]:
usage: 
- Send a <b>GET</b> request to the [main route](http://project-308.herokuapp.com/api/comments). 
- Body of the request should contain `id` parameter where the value is the _id of the comment.
- Returns the COMMENT.

failstate:
- If the comment can not be found, response code is 500, error is "EMPTY".

### <b>Post a comment</b> [POST]:
usage:
- Send a <b>POST</b> request to the [main route](http://project-308.herokuapp.com/api/comments). 
- Body of the request should contain `post`, `user`, and `text` parameters where `post` is the _id attribute of post, `user` is the _id attribute of the user, and `text` is the text of the comment.

failstate:
- If the user can not be found, response code is 500, error is "EMPTY".
- If the post can not be found, response code is 500, error is "EMPTY".

### <b>Delete a comment</b> [DELETE]:
usage:
- Send a <b>DELETE</b> request to the [main route](http://project-308.herokuapp.com/api/comments).
- Body of the requets should contain an `id` parameter where it is the _id attributeof the comment.

# TOPICS:

- ## Main Route -> http://project-308.herokuapp.com/api/topics

## There are 3 functions regarding topics:

### <b>Add a topic to a post</b> [PUT]:
usage: 
- Send a <b>PUT</b> request to the [main route](http://project-308.herokuapp.com/api/topics). 
- Body of the request should contain `id` and `topic` parameters where id is the _id of the post and topic is the string of the topic.
- Returns the POST.

failstate:
- If the post can not be found, response code is 500, error is "EMPTY".

### <b>Remove a topic from post</b> [DELETE]:
usage:
- Send a <b>DELETE</b> request to the [main route](http://project-308.herokuapp.com/api/topics). 
- Body of the request should contain `id` and `topic` parameters where id is the _id of the post and topic is the string of the topic.
- Returns the POST.

failstate:
- If the post can not be found, response code is 500, error is "EMPTY".

### <b>Get all posts with topic</b> [GET]:
usage:
- Send a <b>GET</b> request to the [main route](http://project-308.herokuapp.com/api/topics).
- Body of the requets should contain a `topic` parameter where it is the topic you are searching for.
- Returns a list of POSTs.

failstate:
- if no posts can be found, response code is 500, error is "EMPTY"