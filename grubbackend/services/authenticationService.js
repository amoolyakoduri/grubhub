const db = require('../database').db;


var authenticate = (email,password) => {
    return new Promise( (resolve,reject) => {
        db.query('SELECT * FROM users WHERE emailId = ? ',[email],function (error, results, fields) {
            if(error) {
                reject("Invalid Credentials!");
            }
            if(results[0] && password === results[0].password) {
                console.log("logged in!");
                resolve("loggedIn");
            } else {
                reject("Invalid Credentials!");
            }
        })
    })
    
}

var createAccount = (email,password,firstName,lastName,type,displayPic) => {
    return new Promise( (resolve,reject) => {
        db.query('INSERT INTO users VALUES( ? , md5(?))',[email,password],function(error,results,fields) {
            if(error) {
                console.log("Error occurred.");
                reject("Invalid Credentials!");
            } else {
                db.query('INSERT INTO user_details VALUES( ? , ?, ? ,null,null,?,?)',[email,firstName,lastName,type,displayPic],function(error,results,fields){
                    if(error) {
                        console.log("Error occurred.");
                        reject("Invalid Credentials!");
                    } else {
                        console.log("Registration successful!");
                        resolve(results);
                    } 
                })
            }
        })
    })
    
}

var createRestaurant = (name,phone,cusine,address,zipcode,emailId,displayPic) => {
    return new Promise( (resolve,reject) => {
        db.query('INSERT INTO restaurant (name,zip,phone,cuisine,address,ownerEmail,displayPic) VALUES(? , ?, ? , ? , ?, ?,?)',
        [name,zipcode,phone,cusine,address,emailId,displayPic],
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