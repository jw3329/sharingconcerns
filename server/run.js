const express = require('express');

const mongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://localhost:27017/sharingconcerns';

const PORT = 8000;

const app = express();

app.get('/', (req, res) => {
    // make client connect to mongo service
    mongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        console.log("Database created!");
        // print database name
        console.log("db object points to the database : " + db.databaseName);
        // after completing all the operations with db, close it.
        db.close();
    });
});

const server = app.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
});