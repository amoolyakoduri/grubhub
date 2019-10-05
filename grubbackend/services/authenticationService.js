const db = require('../database');
const errorLog = require('./errorService');


var authenticate = (email,password) => {
    return new Promise( (resolve,reject) => {
        db.query('SELECT * FROM USERS WHERE emailId = ? ',[email],function (error, results, fields) {
            if(error) {
                reject(errorLog.invalidCred);
            }
            if(results[0] && password === results[0].password) {
                console.log("logged in!");
                resolve("loggedIn");
            } else {
                reject(errorLog.invalidCred);
            }
        })
    })
    
}

var createAccount = (email,password,firstName,lastName,type,displayPic) => {
    return new Promise( (resolve,reject) => {
        db.query('INSERT INTO users VALUES( ? , md5(?))',[email,password],function(error,results,fields) {
            if(error) {
                console.log("Error occurred.");
                reject(errorLog.invalidCred);
            } else {
                db.query('INSERT INTO user_details VALUES( ? , ?, ? ,null,null,?,?)',[email,firstName,lastName,type,displayPic],function(error,results,fields){
                    if(error) {
                        console.log("Error occurred.");
                        reject(errorLog.invalidCred);
                    } else {
                        console.log("Registration successful!");
                        resolve(results);
                    } 
                })
            }
        })
    })
    
}

var createRestaurant = (name,phone,cusine,address,zipcode,emailId) => {
    return new Promise( (resolve,reject) => {
        db.query('INSERT INTO restaurant (name,zip,phone,cuisine,address,ownerEmail) VALUES(? , ?, ? , ? , ?, ?)',
        [name,zipcode,phone,cusine,address,emailId],
        function(error,results,fields) {
            if(error) {
                console.log("Error occurred in createRestaurant.");
                reject("error");
            } else {
                console.log("Restaurant created ",results);
                resolve(results);
            }
        })
    })
}


module.exports.authenticate = authenticate;
module.exports.createAccount = createAccount;
module.exports.createRestaurant = createRestaurant;