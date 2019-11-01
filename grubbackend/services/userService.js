const db = require('../database').db;
const userSchema = require('./../models/users').User;
const restSchema = require('./../models/restaurants').Restaurant;
const orderSchema = require('./../models/orders').Order;
const orderItemsSchema = require('./../models/orders').OrderItems;
const chatSchema = require('./../models/orders').Chat;


// var getUserDetails = (email) => {
//     return new Promise(function(resolve, reject){
//     db.query('SELECT * FROM user_details WHERE emailId = ? ',[email],function (error, results, fields) {
//         if(error) {
//             console.log("error in getUserDetails");
//             reject("error");
//         } else {
//         resolve(results[0]);
//         }
//     })
// })}

var getUserDetails = (email) => {
    return new Promise(function(resolve, reject){
        userSchema.find({emailId : email}, function(err,results){
            if(err) {
                console.log("error in getUserDetails");
                reject("error");
            } else {
            resolve(results);
            }
        })
})}

var updateDetails = (oldEmail,userDetails, existingUserDetails) => {
    const firstName = userDetails.firstName || existingUserDetails.firstName;
    const lastName = userDetails.lastName || existingUserDetails.lastName;
    const address = userDetails.address || existingUserDetails.address;
    const phone = userDetails.phone || existingUserDetails.phone;
    return new Promise(function(resolve,reject) {
        db.query('UPDATE user_details SET firstName = ? , lastName = ? , address = ?, phone = ?  WHERE emailId = ?',
        [firstName,lastName,address,phone,oldEmail],
        function(error,results,fields){
            if(error) {
                console.log("Error in updateDetails ");
                reject("Error");
            } else {
                if( userDetails.emailId){
                db.query('update users set emailId = ? where emailId = ?',[userDetails.emailId,oldEmail],function(error,results,fields){
                    if(error){
                        console.log("Error in updateDetails");
                        reject("Error");
                    } else {
                        resolve(results);
                    }
                })
            }else resolve(results);
            }
        })
    })
}

var updateEmail = (oldEmail,newEmail) => {
    return new Promise(function(resolve,reject) {
        db.query('UPDATE users SET emailId = ? WHERE emailId = ?', [newEmail,oldEmail],function(error,results,fields){
            if(error) {
                console.log("error in updateEmail");
                reject("Error");
            } else {
                db.query('UPDATE user_details SET emailId = ? WHERE emailId = ?', [newEmail,oldEmail],function(error,results,fields){
                    if(error) {
                        console("Error in updateEmail");
                        reject("error");
                    }
                    else {
                        resolve(results[0]);
                    }
                })
            }
        })
    })
}

var updatePassword = (email,oldPassword,newPassword) => {
    return new Promise(function(resolve,reject) {
        db.query('UPDATE users SET password = ? WHERE emailId = ? and password = ?',[newPassword,email,oldPassword,],function(error,results,fields){
            if(error) {
                console.log("Error in updatePassword");
                reject("error");
            } else {
                resolve(results);
            }
        })
    })
}

// var placeOrder = (restId,emailId,orderItems,deliveryDetails) => {
//     return new Promise(function(resolve,reject) {
//         var amt = 0;
//         var status = 1;
//         var orderId ;
//         const promise = orderItems.map( (orderItem) => {
//             amt = amt + (orderItem.quantity * orderItem.price);
//         })
//         Promise.resolve(promise).then( () => {
//             db.query('insert into orders (name,address,amt,emailId,statusId,restId) values(?,?,?,?,?,?)',
//             [deliveryDetails.firstName,deliveryDetails.address,amt,emailId,status,restId],function(error,results,fields) {
//                 if(error) {
//                     console.log("Error in placeOrder");
//                     reject("error");
//                 } else {
//                     orderId = results.insertId;
//                     orderItems.map( (orderItem) => {
//                         db.query('insert into order_items(orderId,itemId,quantity) values(?,?,?)',
//                         [orderId,orderItem.itemId,orderItem.quantity],function(error,results,fields){
//                             if(error) {
//                                 console.log("Error in placeOrder");
//                                 reject("error");
//                             } else {
//                                 console.log("Order placed ");
//                                 resolve(results[0]);
//                             }

//                         })
//                     })
//                 }
//             })}).catch( () => {
//                 console.log("error in placeOrder");
//                 reject("error");
//             })
// })}

var placeOrder = (restName,emailId,orderItems,deliveryDetails) => {
    return new Promise(function(resolve,reject) {
        var amt = 0;
        const promiseForAmt = orderItems.map( (orderItem) => {
            amt = amt + (orderItem.quantity * orderItem.price);
        })
        Promise.resolve(promiseForAmt).then( () => {
            var orderItemsArray = [];
            const promiseForOrderItems = orderItems.map( (orderItem) => {
                orderItemsInstance = new orderItemsSchema({name : orderItem.itemName,quantity:orderItem.quantity,price:orderItem.price});
                orderItemsArray.push(orderItemsInstance);
            })
            Promise.resolve(promiseForOrderItems).then( () => {
                orderInstance = new orderSchema({name : deliveryDetails.firstName, address : deliveryDetails.address,
                    amt : amt, emailId : emailId, restName : restName, status : "New", order_items : orderItemsArray })
                orderInstance.save(function(err,results){
                    if(err) {
                        console.log("Error in placeOrder");
                        reject(err);
                    } else {
                        console.log("Order placed ");
                        resolve(results);
                    }
                })
            })
        })
    })
}
 


// var pastOrders = (email) => {
//     return new Promise(function(resolve,reject) {
//         db.query('SELECT o.*,r.name as restName,r.displayPic as displayPic from orders o inner join restaurant r on o.restId = r.id where emailId = ? and statusId in (4,5)',[email],function(error,results,fields) {
//             if(error) {
//                 console.log("error in pastOrders");
//                 reject("error");
//             } else {
//                 resolve(results);
//             }
//         })
//     })
// }


var pastOrders = (email) => {
    return new Promise(function(resolve,reject) {
        orderSchema.find({emailId:email,$or : [{status:"Delivered"},{status:"Cancelled"}]},function(err,results){
            if(err) {
                console.log("error in pastOrders");
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

// var upcomingOrders = (email) => {
//     return new Promise(function(resolve,reject) {
//         db.query('SELECT o.*,r.name as restName,r.displayPic as displayPic from orders o inner join restaurant r on o.restId = r.id where emailId = ? and statusId not in (4,5)',[email],function(error,results,fields) {
//             if(error) {
//                 console.log("error in upcomingOrders");
//                 reject("error");
//             } else {
//                 resolve(results);
//             }
//         })
//     })
// }


var upcomingOrders = (email) => {
    return new Promise(function(resolve,reject) {
        orderSchema.find({emailId:email,$or : [{status:"New"},{status:"Preparing"},{status:"Ready"}]},function(err,results){
            if(err) {
                console.log("error in pastOrders");
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

// var getRestaurants = () => {
//     return new Promise(function(resolve,reject){
//         db.query('SELECT * FROM restaurant',function(error,results,fields) {
//             if(error){
//                 console.log("Error in getRestaurants");
//                 reject("error");
//             } else {
//                 resolve(results);
//             }
//         })
//     })
// }



// var search = (name,item,cuisine) => {
//     return new Promise(function(resolve,reject){
//         let query="select distinct r.* from restaurant r, menu m where ";
//         let arr1 = [];
//         if(name != "") {
//             query = query + "r.name like \"%"+name+"%\"";
//             arr1.push(name);
//             if(cuisine!="" || item!="")
//             query = query+ "and";
//         }
//         if(cuisine != "") {
//             query = query + " r.cuisine like \"%"+cuisine+"%\"";
//             arr1.push(cuisine);
//             if(item!="")
//             query = query + "and"
//         }
//         if(item != "") {
//             query = query + " m.name like \"%"+item+"%\" and m.restId = r.id";
//             arr1.push(item);
//         }
//         db.query(query,null,function(error,results,fields){
//             if(error) {
//                 console.log("Error in search api");
//                 reject("error");
//             } else {
//                 resolve(results);
//             }
//         })
//     })
// }

var search = (name,item,cuisine) => {
    return new Promise(function(resolve,reject){
        let findObj = {};
        if(name!=""){
            findObj["name"]=name;
        }
        if(cuisine!=""){
            findObj["cuisine"]=cuisine;
        }
        if(item!=""){
            findObj["menu.name"]=item;
        }
        restSchema.find(findObj,function(err,results){
            if(err) {
                console.log("Error in search api");
                reject("error");
            } else {
                resolve(results);
            }
        })
    })
}

module.exports.getUserDetails = getUserDetails;
module.exports.updateEmail = updateEmail;
module.exports.updatePassword = updatePassword;
module.exports.pastOrders = pastOrders;
module.exports.upcomingOrders = upcomingOrders;
module.exports.updateDetails = updateDetails;
module.exports.search  = search;
module.exports.placeOrder = placeOrder;