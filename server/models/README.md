# Schema design for sharingconcerns
### This is made in MongoDB mongoose schema formatting

## Users
```javascript
{
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    }, username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }, firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 25
    }, lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 25
    },
    posts: [Mongoose.Schema.Types.ObjectId],
    likes: new Mongoose.Schema({
        posts: [Mongoose.Schema.Types.ObjectId],
        comments: [Mongoose.Schema.Types.ObjectId]
    }),
    dislikes: new Mongoose.Schema({
        posts: [Mongoose.Schema.Types.ObjectId],
        comments: [Mongoose.Schema.Types.ObjectId]
    }),
    views: [Mongoose.Schema.Types.ObjectId],
    replied: [Mongoose.Schema.Types.ObjectId],
    comments: [Mongoose.Schema.Types.ObjectId],
    followers: [Mongoose.Schema.Types.ObjectId],
    followees: [Mongoose.Schema.Types.ObjectId],
    salt: String,
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    }, updateDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}
```

## Posts
```javascript
{
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [Mongoose.Schema.Types.ObjectId],
    dislikes: [Mongoose.Schema.Types.ObjectId],
    comments: [Mongoose.Schema.Types.ObjectId],
    creationDate: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now
    }, updateDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}
```

## Comments
```javascript
{
    description: {
        type: String,
        required: true
    },
    likes: [Mongoose.Schema.Types.ObjectId],
    dislikes: [Mongoose.Schema.Types.ObjectId],
    replies: [Mongoose.Schema.Types.ObjectId],
    creationDate: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now
    }, updateDate: {
        type: Date,
        required: true,
        default: Date.now
    }
}
```