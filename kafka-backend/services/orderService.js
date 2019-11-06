const orderSchema = require('./../models/orders').Order;
const chatSchema = require('./../models/orders').Chat;
const orderItemsSchema = require('./../models/orders').OrderItems;
var mongoose = require('mongoose');

function handle_request(body, callback){
   
    console.log("Inside book kafka backend");
    console.log(JSON.stringify(body));
    switch(body.msg){
        case "PlaceOrder" :
            placeOrder(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        case "UpdateOrder" :
            updateOrderStatus(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        case "PastOrdersByBuyerEmail" :
            getPastOrdersByBuyerEmail(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        case "UpcomingOrdersByBuyerEmail" :
            getUpcomingOrdersByBuyerEmail(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        case "GetOrdersByRestName" :
            getOrdersByRestName(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        case "GetPastOrdersByRestName" :
            getPastOrdersByRestName(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        case "GetOrdersByRestName" :
            getOrdersByRestName(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        case "GetOrdersByStatus" :
            getOrdersByStatus(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            }) 
            break;
        case "SendMessage" :
            sendMessage(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        case "GetChat" :
            getChatForOrderId(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })  
            break;
        default : 
            defaultFunc(body.payload);
            break;
    }
    console.log("after callback");
};

var getChatForOrderId = (paylaod) => {
    return new Promise(function(resolve,reject){
        orderSchema.find({"_id":paylaod.orderId},function(err,results){
            if(err) {
                console.log("Error in getMessagesForOrderId");
                reject(err);
            } else {
                resolve(results.chat);
            }
        })
    })
}

var sendMessage = (paylaod) => {
    return new Promise(function(resolve,reject){
        chatInstance = new chatSchema({text:paylaod.text,senderId:paylaod.senderId});
        orderSchema.update({_id:paylaod.orderId},{$push : {"chat" : chatInstance}},function (err,results){
            if(err){
                console.log("Error in sendMessage");
                reject(err);
            } else {
                resolve(results);
            } 
        })
    })
}

var getOrdersByRestName = (payload) => {
    return new Promise(function(resolve,reject) {
        orderSchema.find({
            restName:payload.restName,
            $or : [{status:"New"},{status:"Preparing"},{status:"Ready"}]
        },function(err,results){
            if(err) {
                console.log("Error in getOrders");
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

var placeOrder = (payload) => {
    var restPic = payload.restPic;
    var restName = payload.restName;
    var emailId = payload.email;
    var orderItems = payload.orderItems;
    var deliveryDetails = payload.deliveryDetails;
    return new Promise(function(resolve,reject) {
        var amt = 0;
        const promiseForAmt = orderItems.map( (orderItem) => {
            amt = amt + (orderItem.quantity * orderItem.price);
        })
        Promise.resolve(promiseForAmt).then( () => {
            var orderItemsArray = [];
            const promiseForOrderItems = orderItems.map( (orderItem) => {
                orderItemsInstance = new orderItemsSchema({name : orderItem.name,quantity:orderItem.quantity,price:orderItem.price});
                orderItemsArray.push(orderItemsInstance);
            })
            Promise.resolve(promiseForOrderItems).then( () => {
                orderInstance = new orderSchema({name : deliveryDetails.firstName, address : deliveryDetails.address,
                    amt : amt,restPic:restPic, buyerEmail : emailId, restName : restName, status : "New", order_items : orderItemsArray })
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

var getUpcomingOrdersByBuyerEmail = (payload) => {
    return new Promise(function(resolve,reject) {
        orderSchema.find({
            buyerEmail:payload.email,
            $or : [{status:"New"},{status:"Preparing"},{status:"Ready"}]
        },function(err,results){
            if(err) {
                console.log("error in upcomingOrders",err.message);
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

var getPastOrdersByBuyerEmail = (payload) => {
    return new Promise(function(resolve,reject) {
        orderSchema.find({
            buyerEmail:payload.email,
            $or : [{status:"Delivered"},{status:"Cancelled"}]
        },function(err,results){
            if(err) {
                console.log("error in pastOrders");
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}


var getPastOrdersByRestName = (payload) => {
    return new Promise(function(resolve,reject) {
        orderSchema.find({
            restName:payload.restName,
            $or : [{status:"Delivered"},{status:"Cancelled"}]
        },function(err,results){
            if(err) {
                console.log("Error in getOrders");
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

var updateOrderStatus = (paylaod) => {
    return new Promise(function(resolve,reject) {
        var id = new mongoose.Types.ObjectId(paylaod.orderId);
        orderSchema.update({'_id' : id},{status:paylaod.status},function(err,results){
            if(err) {
                console.log("Error in updateOrderStatus");
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

var getOrdersByStatus = (paylaod) => {
    return new Promise(function(resolve,reject) {
        orderSchema.find({
            restName:paylaod.restName,
            status:paylaod.status
        },function(err,results){
            if(err) {
                console.log("Error in getOrdersByStatus");
                reject(err.message);
            } else {
                resolve(results);
            }
        })
    })
}

var defaultFunc = (payload) => {
    console.log("payload recieved is ",JSON.stringify(payload));
    return;
}

module.exports.handle_request = handle_request;