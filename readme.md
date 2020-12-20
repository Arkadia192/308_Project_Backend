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

All of the requests are type GET and most doesn't require a body parameter. This means many basic functions can used and tested on the browser by going to the links. I see that this would not be the case for a normal application since it breaks the http standarts but it speeds up the production and time is our most valuable resource.

## There are 5 functions regarding users:

### <b>Get all users</b> [GET]:
usage: 
- Send an empty get request to the [main route](http://project-308.herokuapp.com/api/users). 
- Returns a comma seperated list of JSON objects of type USER.

failstate:
- If there are no users to be found, response code is 500, error is "EMPTY".

### <b>Get a single user</b> [GET]:
usage:
- Send an empty get request to `/name` on top of the main route. (ex: http://project-308.herokuapp.com/api/users/berk)
- `name` is the username of the user you want.
- Returns the user you want as a JSON object.

failstate:
- If the user can't be found, responce code is 500, error is "EMPTY".

### <b>Create a user</b> [GET]:
usage:
- Send a get request to `/name/password` on top of the main route. (ex: http://project-308.herokuapp.com/api/users/berk/1234)
- `name` is the username and `password` is the password. The request body can be empty.
- Any additional information about the user can be given in the body of the get request. So if you want to create a user AND give it a profile picture at the same time, you can pass `{pp: link}` in the body of the request.
- Returns the fresh user as a JSON object.

failstate:
- Since the username is a key value in the database, if you try to create an already existing user, response code is 500 and error is "DUPLICATE".

### <b>Delete a user</b> [GET]:
usage:
- Send an empty get request to `/delete/name` on top of the main route. (ex: http://project-308.herokuapp.com/api/users/delete/berk)
- `name` is the username of who you want to delete.
- Returns the deleted user as a JSON object.

failstate:
- If the user with the `name` can not be found, response code is 500, error is "EMPTY"

### <b>Update a user</b> [GET]:
usage:
- Send a get request to `/update/key` on top of the main route (ex: http://project-308.herokuapp.com/api/users/update/5fda118d4e74f60017e52fb2 or http://project-308.herokuapp.com/api/users/update/berk)
- `key` is either the _id attribute of the user or the username attribute of the user.
- Give the attributes you want to change in the <b>body</b> of the request. (ex: update password -> `{password: "123456"}`)

failstate:
- If the user with the given _id or username can not be found, response code is 500, error is "EMPTY"
- Since there are many ways for this function to fail, not everything was suitable to handle in the server. Be careful about which attributes you are trying to change since if you try to change an attribute that doesn't exist, you will get an error with response code 200 (OK).
