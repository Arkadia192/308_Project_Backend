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
- Returns a comma seperated list of JSON objects of type POST.

failstate:
- If there are no posts to be found, response code is 500, error is "EMPTY".
- If the user can not be found, response code is 500, error is "EMPTY".

### <b>Create a post</b> [POST]:
usage:
- Send a <b>POST</b> request to `/user` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/berk)
- All the parameters of the post should be given in the body of the request in JSON format. (ex: `{"text": "asdasd"}`)

failstate:
- If the user can not be found, response code is 500, error is "EMPTY".

### <b>Delete a post</b> [DELETE]:
usage:
- Send an empty <b>DELETE</b> request to `/postID` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/5ff1e1a91e2c5e49f42af0ca)
- Post id is the _id attribute of the post given by default by mongodb.

failstate:
- If the post can not be found, response code is 500, error is "EMPTY".
- If the postID is invalid, responce code is 500, message is "Id is invalid".

### <b>Update a post</b> [PUT]:
usage:
- Send a <b>PUT</b> request to `/postID` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/5ff1e1a91e2c5e49f42af0ca)
- Post id is the _id attribute of the post given by default by mongodb.
- Place every attribute you want to change in the body of the request. (ex: `{"text": newText}`)

failstate:
- If the post can not be found, response code is 500, error is "EMPTY".
- If the postID is invalid, responce code is 500, message is "Id is invalid".

### <b>Like a post</b> [PUT]:
usage:
- Send an empty <b>PUT</b> request to `/like/postID` on top of the main route (ex: http://project-308.herokuapp.com/api/posts/like/5ff1e1a91e2c5e49f42af0ca)
- If the request can be processed without any errors, like count is increased by 1.

failstate:
- If the post can not be found, response code is 500, error is "EMPTY".
- If the postID is invalid, responce code is 500, message is "Id is invalid".