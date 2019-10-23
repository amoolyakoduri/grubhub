const mysql = require('mysql');
//var MongoClient = require('mongodb').MongoClient

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/grubhub1', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// MongoClient.connect('mongodb://localhost:27017/animals', function (err, client) {
//   if (err) throw err

//   var db = client.db('animals')

//   db.collection('mammals').find().toArray(function (err, result) {
//     if (err) throw err

//     console.log(result)
//   })
// })


const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'grubhub',
    insecureAuth : true
});

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password', 
    database: 'grubhub'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

// module.exports.db  = db;
module.exports.db = pool;
module.exports.mongoose = mongoose.connection;