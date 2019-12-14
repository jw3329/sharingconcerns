# API descriptions

>Please find that big subject will come as prefix url, followed by next url

For example,

## Test APIs `/test`

`/testing-this-url`

>This will indicate the link to make api request:

`http://SERVER_NAME/api/test/testing-this-url`


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

- When successfully created (200)
    - `User has successfully created`
- If user exists (400)
    - `Given user exists`

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
    - `User already has signed in`

- If wrong password (400)
    - `Password does not match`

- If No user (400)
    - `User does not exist with given username`