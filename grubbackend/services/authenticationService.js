const db = require('../database').db;
const userSchema = require('./../models/users').User;
const restSchema = require('./../models/restaurants').Restaurant;


// var authenticate = (email,password) => {
//     return new Promise( (resolve,reject) => {
//         db.query('SELECT * FROM users WHERE emailId = ? ',[email],function (error, results, fields) {
//             if(error) {
//                 reject("Invalid Credentials!");
//             }
//             if(results[0] && password === results[0].password) {
//                 console.log("logged in!");
//                 resolve("loggedIn");
//             } else {
//                 reject("Invalid Credentials!");
//             }
//         })
//     })
//    }

var authenticate = (email,password) => {
    return new Promise( (resolve,reject) => {
        userSchema.find({emailId:email, password:password}, function(err,user){
            if(err){
                console.log("error in authenticate")
                reject("error");
            } else {
                console.log("logged in!");
                resolve("loggedIn");
            }
        })
    })
}

var findUser = (email) => {
    return new Promise( (resolve,reject) => {
        db.query('SELECT * FROM users WHERE emailId = ? ',[email],function (error, results, fields) {
            if(error) {
                reject("Invalid Credentials!");
            }
            //if(results[0] && password === results[0].password) {
            //    console.log("logged in!");
                resolve(results);
            //} else {
            //    reject("Invalid Credentials!");
            //}
        })
    })
    
}

// var createAccount = (email,password,firstName,lastName,type,displayPic) => {
//     return new Promise( (resolve,reject) => {
//         db.query('INSERT INTO users VALUES( ? , md5(?))',[email,password],function(error,results,fields) {
//             if(error) {
//                 console.log("Error occurred.");
//                 reject("Invalid Credentials!");
//             } else {
//                 db.query('INSERT INTO user_details VALUES( ? , ?, ? ,null,null,?,?)',[email,firstName,lastName,type,displayPic],function(error,results,fields){
//                     if(error) {
//                         console.log("Error occurred.");
//                         reject("Invalid Credentials!");
//                     } else {
//                         console.log("Registration successful!");
//                         resolve(results);
//                     } 
//                 })
//             }
//         })
//     })  
// }

var createUser = (emailId,password,userDetails) => {
    return new Promise( (resolve,reject) => {
        var userInstance = new userSchema({emailId,password,userDetails});
        userInstance.save(function(err,results){
            if(err){
                console.log("error in create user")
                reject("error");
            } else {
                console.log("user created! ",results);
                resolve(results);
            }
        })
    })
}





// var createRestaurant = (name,phone,cusine,address,zipcode,emailId,displayPic) => {
//     return new Promise( (resolve,reject) => {
//         db.query('INSERT INTO restaurant (name,zip,phone,cuisine,address,ownerEmail,displayPic) VALUES(? , ?, ? , ? , ?, ?,?)',
//         [name,zipcode,phone,cusine,address,emailId,displayPic],
//         function(error,results,fields) {
//             if(error) {
//                 console.log("Error occurred in createRestaurant.");
//                 reject("error");
//             } else {
//                 console.log("Restaurant created ",results);
//                 resolve(results);
//             }
//         })
//     })
// }

var createRestaurant = (name,phone,cusine,address,zipcode,emailId,displayPic) => {
    return new Promise( (resolve,reject) => {
        var restInstance = new restSchema({name,zip,phone,cusine,address,emailId,displayPic,sections});
        restInstance.save(function(err,results){ 
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

// var createUser = (emailId,password,userDetails) => {
//     return new Promise( (resolve,reject) => {
//         var userInstance = new userSchema({emailId,password,userDetails});
//         userInstance.save(function(err){
//             if(err) console.log("error");
//         })
//     })
// }


module.exports.authenticate = authenticate;
module.exports.createUser = createUser;
module.exports.createRestaurant = createRestaurant;
module.exports.createUser = createUser;
module.exports.findUser = findUser;