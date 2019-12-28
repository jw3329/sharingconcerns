# API descriptions

>Please find that big subject will come as prefix url, followed by next url

For example,

## Test APIs `/test`

`/testing-this-url`

> This will indicate the link to make api request:

`http://SERVER_NAME/api/test/testing-this-url`

## Authorized required:

> The API that is needed to be authorize should have credential in the session. Otherwise it will have this error message:

```json
{
    "message": "User is not authorized"
}
```

## User APIs `/user`

### Signing up the user
`POST /signup`

This API signs up the user

> use case

```json
{
	"email": "test_email@sharingconcerns.com",
	"username": "test_username",
	"password": "test_password",
	"firstName":"test_firstName",
	"lastName":"test_lastName"
}
```

> response

- When successfully created (201)
```json
{
    "message": "User has successfully created"
}
```
- If user exists (400)
```json
{
    "message": "Given user exists"
}
```
### Authorizing the user
`POST /authorize`

This API authorizes the user.

- This will store session credential.

- This will not work if user already has signed in.

> use case

```json
{
	"username": "test_username",
	"password": "test_password"
}
```

> response
- When successfully authorized (200)
```json
{
    "comments": [],
    "_id": "5df434f6bfdbeb0e9da45a74",
    "email": "test_email@sharingconcerns.com",
    "username": "test_username",
    "firstName": "test_firstname",
    "lastName": "test_lastname",
    "creationDate": "2019-12-14T01:03:50.526Z",
    "updateDate": "2019-12-14T01:03:50.528Z",
    "__v": 0
}
```
- If Already signed (400)
```json
{
    "message": "User already has signed in"
}
```

- If wrong password (400)
```json
{
    "message": "Password does not match"
}
```
- If No user (400)
```json
{
    "message": "User does not exist with given username"
}
```

### Following the user

`POST /follow` (Auth required)

This API follows the user.

- If currently user is following followee, it will unfollow

- If currently user is not following followee, it will follow

> use case

```json
{
	"username":"test_username2"
}
```

> response
- When successfully followed (200)
```json
{
    "message": "Successfully followed user"
}
```

- When successfully unfollowed (200)
```json
{
    "message": "Successfully unfollowed user"
}
```

- If username to follow does not exist (400)
```json
{
    "message": "The user does not exist"
}
```

## Post APIs `/post`

### Post the post

`POST /` (Auth required)

This API posts the post of user.

> use case

```json
{
	"title": "haha",
	"description": "123123123"
}
```

> response
- When successfully created the post (201)
```json
{
    "data": {
        "views": 0,
        "likes": [],
        "dislikes": [],
        "comments": [],
        "_id": "5df57db0dd9ab606184bc901",
        "title": "haha",
        "description": "123123123",
        "creationDate": "2019-12-15T00:26:24.007Z",
        "updateDate": "2019-12-15T00:26:24.007Z",
        "__v": 0
    },
    "message": "Successfully created"
}
```

`GET /:postThread` (Auth required)

This API gets the post of postThread.

> response
- When successfully grabbed the post (200)
```json
{
    "post": {
        "views": 0,
        "likes": [],
        "dislikes": [],
        "comments": [],
        "_id": "5df57db0dd9ab606184bc901",
        "title": "haha",
        "description": "123123123",
        "creationDate": "2019-12-15T00:26:24.007Z",
        "updateDate": "2019-12-15T00:26:24.007Z",
        "__v": 0
    },
    "status": true
}
```


### Comment on the post

`POST /<post_thread>/comment` (Auth required)

This API comments on the given thread post.

> use case

```json
{
	"description": "This is a comment testing purpose"
}
```

> response
- When successfully commented the post (201)
```json
{
    "comment": {
        "likes": [],
        "dislikes": [],
        "replies": [],
        "_id": "5df5877216df040b073fdc65",
        "description": "This is a comment testing purpose",
        "creationDate": "2019-12-15T01:08:02.365Z",
        "updateDate": "2019-12-15T01:08:02.365Z",
        "__v": 0
    },
    "message": "Successfully created comment"
}
```

### Get all comments on the post

`GET /<post_thread>/comments`

This API gets all comments on the given thread post.

> use case

> response
- When successfully got the comments (200)
```json
[
    {
        "likes": [],
        "dislikes": [],
        "replies": [],
        "_id": "5df5877216df040b073fdc65",
        "description": "This is a comment testing purpose",
        "creationDate": "2019-12-15T01:08:02.365Z",
        "updateDate": "2019-12-15T01:08:02.365Z",
        "__v": 0
    }
]
```

- When requested in non existing thread post (400)
```json
{
    "message": "Cast to ObjectId failed for value \"5df57db0dd9ab606184bc9011\" at path \"_id\" for model \"Post\""
}
```

### Like or dislike the post

> Like the post

`POST /<post_thread>/like`

This API will like or unlike the post by user

> use case

> response
- When successfully liked the post (200)
```json
{
    "message": "Successfully marked like"
}
```

- When successfully unliked the post (200)
```json
{
    "message": "Successfully unmarked like"
}
```

- When requested in non existing thread post (400)
```json
{
    "message": "Cast to ObjectId failed for value \"5df57db0dd9ab606184bc9011\" at path \"_id\" for model \"Post\""
}
```

> Dislike the post

`POST /<post_thread>/dislike`

This API will dislike or undislike the post by user

> use case

> response
- When successfully disliked the post (200)
```json
{
    "message": "Successfully marked dislike"
}
```

- When successfully undisliked the post (200)
```json
{
    "message": "Successfully unmarked dislike"
}
```

- When requested in non existing thread post (400)
```json
{
    "message": "Cast to ObjectId failed for value \"5df57db0dd9ab606184bc9011\" at path \"_id\" for model \"Post\""
}
```

### Like or dislike the comment

> Like the comment

`POST /<post_thread>/like`

This API will like or unlike the comment by user

> use case

> response
- When successfully liked the comment (200)
```json
{
    "message": "Successfully marked like"
}
```

- When successfully unliked the comment (200)
```json
{
    "message": "Successfully unmarked like"
}
```

- When requested in non existing thread comment (400)
```json
{
    "message": "Cast to ObjectId failed for value \"5df57db0dd9ab606184bc9011\" at path \"_id\" for model \"Post\""
}
```

> Dislike the comment

`POST /<post_thread>/dislike`

This API will dislike or undislike the comment by user

> use case

> response
- When successfully disliked the comment (200)
```json
{
    "message": "Successfully marked dislike"
}
```

- When successfully undisliked the comment (200)
```json
{
    "message": "Successfully unmarked dislike"
}
```

- When requested in non existing thread comment (400)
```json
{
    "message": "Cast to ObjectId failed for value \"5df57db0dd9ab606184bc9011\" at path \"_id\" for model \"Post\""
}
```

## Comment APIs `/comment`

### Reply on the comment

`POST /<comment_id>/reply` (Auth required)

This API replies on the given comment.

> use case

```json
{
	"description": "This is testing comment reply"
}
```

> response
- When successfully replied the comment (201)
```json
{
    "message": "Successfully created reply",
    "reply": {
        "likes": [],
        "dislikes": [],
        "replies": [],
        "_id": "5dfababbefe427231abb2fbf",
        "description": "This is testing comment reply",
        "creationDate": "2019-12-18T23:48:11.698Z",
        "updateDate": "2019-12-18T23:48:11.698Z",
        "__v": 0
    }
}
```


> Like the comment

`POST /<comment_id>/like`

This API will like or unlike the post by user

> use case

> response
- When successfully liked the post (200)
```json
{
    "message": "Successfully marked like"
}
```

- When successfully unliked the post (200)
```json
{
    "message": "Successfully unmarked like"
}
```

- When requested in non existing thread post (400)
```json
{
    "message": "Cast to ObjectId failed for value \"5df57db0dd9ab606184bc9011\" at path \"_id\" for model \"Post\""
}
```

> Dislike the post

`POST /<post_thread>/dislike`

This API will dislike or undislike the post by user

> use case

> response
- When successfully disliked the post (200)
```json
{
    "message": "Successfully marked dislike"
}
```

- When successfully undisliked the post (200)
```json
{
    "message": "Successfully unmarked dislike"
}
```

- When requested in non existing thread post (400)
```json
{
    "message": "Cast to ObjectId failed for value \"5df57db0dd9ab606184bc9011\" at path \"_id\" for model \"Post\""
}
```

### Like or dislike the comment

> Like the comment

`POST /<comment_id>/like`

This API will like or unlike the comment by user

> use case

> response
- When successfully liked the comment (200)
```json
{
    "message": "Successfully marked comment like"
}
```

- When successfully unliked the comment (200)
```json
{
    "message": "Successfully unmarked comment like"
}
```

> Dislike the comment

`POST /<comment_id>/dislike`

This API will dislike or undislike the comment by user

> use case

> response
- When successfully disliked the comment (200)
```json
{
    "message": "Successfully marked comment dislike"
}
```

- When successfully undisliked the comment (200)
```json
{
    "message": "Successfully unmarked comment dislike"
}
```