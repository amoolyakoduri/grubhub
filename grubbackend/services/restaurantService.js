const db = require('../database').db;
const restSchema = require('./../models/restaurants').Restaurant;

var addItem = (restId,name,desc,price,section) => {
    return new Promise( function(resolve,reject) {
        db.query('INSERT INTO menu(name,descr,price,section,restId) VALUES(?,?,?,?,?)',[name,desc,price,section,restId],
        function(error, results, fields) {
            if(error) {
                console.log("Error in addItem");
                reject("error");
            } else {
                console.log("Item added");
                resolve(results);
            }
        })
    })
}

var deleteItem = (restId,itemId,section) => {
    return new Promise( function(resolve,reject) {
        db.query('DELETE FROM menu WHERE restId = ? and id = ? and section=?',[restId,itemId,section],
        function(error, results, fields) {
            if(error) {
                console.log("Error in deleteItem");
                reject("error");
            } else {
                console.log("Item deleted");
                resolve(results[0]);
            }
        })
    })
}

var addSection = (restId,section) => {
    return new Promise( function(resolve,reject) {
        db.query('INSERT INTO sections VALUES( ?, ? ) ',[section,restId],
        function(error, results, fields) {
            if(error) {
                console.log("Error in addSection");
                reject("error");
            } else {
                console.log("Section added");
                resolve(results);
            }
        })
    })
}

var deleteSection = (restId,section) => {
    return new Promise( function(resolve,reject) {
        db.query('DELETE FROM sections WHERE restId = ? and name = ?',[restId,section],
        function(error, results, fields) {
            if(error) {
                console.log("Error in deleteSection");
                reject("error");
            } else {
                console.log("Section deleted");
                resolve(results);
            }
        })
    })
}

var getItemsInSection = (restId,section) => {
    return new Promise( function(resolve,reject) {
        db.query('SELECT * FROM menu WHERE restId = ? and section = ?',[restId,section],function(error,results,fields){
            if(error) {
                console.log("Error in getItemsInSection");
                reject("error");
            } else {
                console.log("Items in section ",section," are : ",results);
                resolve(results);
            }
        })
    })
}

var getOrders = (restId) => {
    return new Promise(function(resolve,reject) {
        db.query(' SELECT o.*,os.status FROM orders o inner join order_status os on o.statusId = os.id WHERE o.restId = ? and o.statusId != 4 and o.statusId!=5',[restId],function(error,results,fields) {
            if(error) {
                console.log("Error in getOrders");
                reject("Error");
            } else {
                console.log("Orders for restId ",restId," are : ",results);
                const promises = results.map( order => {
                    return new Promise(function(resolve,reject) {
                        db.query('SELECT m.name,m.price,oi.quantity FROM order_items oi, menu m where oi.orderId = ? and oi.itemId = m.id',[order.id],
                        function(error,results,fields) {
                            if(error) {
                                console.log("Error in getOrders");
                                reject("error");
                            } else {
                                console.log("items in order no ",order.id," are : ",results);
                                order["items"] = results;
                                console.log("order is ",order);
                                resolve(1);
                            }
                        })
                    })

                })
                Promise.all(promises).then( () => {
                    resolve(results);
                })
            }
        })
    })
}

var getPastOrders = (restId) => {
    return new Promise(function(resolve,reject) {
        db.query(' SELECT o.*,os.status FROM orders o inner join order_status os on o.statusId = os.id WHERE o.restId = ? and (o.statusId = 4 or o.statusId=5)',[restId],function(error,results,fields) {
            if(error) {
                console.log("Error in getPastOrders");
                reject("Error");
            } else {
                console.log("Orders for restId ",restId," are : ",results);
                const promises = results.map( order => {
                    return new Promise(function(resolve,reject) {
                        db.query('SELECT m.name,m.price,oi.quantity FROM order_items oi, menu m where oi.orderId = ? and oi.itemId = m.id',[order.id],
                        function(error,results,fields) {
                            if(error) {
                                console.log("Error in getPastOrders");
                                reject("error");
                            } else {
                                console.log("items in order no ",order.id," are : ",results);
                                order["items"] = results;
                                console.log("order is ",order);
                                resolve(1);
                            }
                        })
                    })

                })
                Promise.all(promises).then( () => {
                    resolve(results);
                })
            }
        })
    })
}



var updateOrderStatus = (restId,orderId,status) => {
    return new Promise(function(resolve,reject) {
        db.query('UPDATE orders SET statusId = ? WHERE id = ? and restId = ?',[status,orderId,restId],function(error,results,fields) {
            if(error) {
                console.log("Error in updateOrderStatus");
                reject("Error");
            } else {
                db.query('select o.id as orderId,s.id as statusId,s.status as status from orders o inner join order_status s on o.statusId=s.id where o.id=?',[orderId],
                function(error,results,fields){
                    if(error) {
                        console.log("Error in updateOrderStatus");
                        reject("Error"); 
                    } else {
                        console.log("Updated Status!");
                        resolve(results[0]);
                    }
                })
            }
        })
    })
}

var getOrdersByStatus = (restId,status) => {
    return new Promise(function(resolve,reject) {
        db.query('SELECT * FROM orders WHERE restId = ? and status=?',[restId,status],function(error,results,fields) {
            if(error) {
                console.log("Error in getOrdersByStatus");
                reject("Error");
            } else {
                console.log("Orders for restId ",restId," and status ",status," are : ",results);
                resolve(results);
            }
        })
    })
}

var getOrderItems = (orderId) => {
    return new Promise(function(resolve,reject) {
        let cart =[];
        db.query('SELECT * FROM order_items where orderId = ?',[orderId],function(error,results,fields){
            if(error) {
                console.log("Error occurred in getOrderItems");
                reject("Error");
            } else {
                console.log("Order items for orderId ",orderId," are : ",results);
                const promises = results.map( result => {
                    return new Promise(function(resolve,reject){
                        let orderItem = {};
                        db.query('select * from menu where id=?',[result.itemId],function(error,results,fields){
                            if(error){
                                console.log("Error occurred in getOrderItems");
                                reject("error");
                            } else {
                                orderItem.itemId = result.itemId,
                                orderItem.quantity = result.quantity,
                                orderItem.price = results[0].price,
                                orderItem.name = results[0].name
                                cart.push(orderItem);
                                resolve(1);
                            }
                        })
                    })
                })
                Promise.all(promises)
                .then( () => {
                    resolve(cart);
                }).catch( () => {
                    console.log("Error occurred in getOrderItems");
                    reject("Error");
                })
            }
        })
    })
}

var getRestDetailsByOwnerEmail = (ownerEmail) => {
    return new Promise(function(resolve,reject) {
        db.query('select * from restaurant where ownerEmail = ?',[ownerEmail],function(error,results,fields){
            if(error){
                console.log("error in getRestDetails");
                reject("error");
            } else {
                resolve(results[0]);
            }
        })
    })
}

var getRestDetailsByRestId = (restId) => {
    return new Promise(function(resolve,reject) {
        db.query('select * from restaurant where id = ?',[restId],function(error,results,fields){
            if(error){
                console.log("error in getRestDetails");
                reject("error");
            } else {
                resolve(results[0]);
            }
        })
    })
}

var getMenu = (restId) => {
    return new Promise(function(resolve,reject) {
        db.query('select name from sections where restId=?',[restId],function(error,results,fields) {
            if(error) {
                console.log("Error in getMenu");
                reject("error");
            } else {
                const promises = results.map( section => {
                    return new Promise(function(resolve,reject) {
                        db.query('select * from menu where restId=? and section=?',[restId,section.name],function(error,results,fields){
                            if(error) {
                                console.log("error in get items for section in getMenu ");
                                reject("error");
                            } else {
                                section["items"] = results;
                                resolve(1);
                            }
                        })
                    })
                })
                Promise.all(promises)
                .then( () => {
                    resolve(results);
                }).catch( (error) => {
                    reject("error");
                })
            }
        })
    })
}

var updateDetails = (restDetails) => {
    return new Promise(function(resolve,reject) {
        db.query('UPDATE restaurant SET name = ? , cuisine = ? , address = ?, phone = ? , zip =?  WHERE id = ?',
        [restDetails.name,restDetails.cuisine,restDetails.address,restDetails.phone,restDetails.zipcode,restDetails.id],
        function(error,results,fields){
            if(error) {
                console.log("Error in updateDetails ");
                reject("Error");
            } else {
                resolve(results);
            }
        })
    })
}

module.exports.deleteItem  = deleteItem;
module.exports.addItem = addItem;
module.exports.deleteSection = deleteSection;
module.exports.addSection  = addSection;
module.exports.getItemsInSection = getItemsInSection;
module.exports.getOrders = getOrders;
module.exports.updateOrderStatus = updateOrderStatus;
module.exports.getOrdersByStatus = getOrdersByStatus;
module.exports.getOrderItems = getOrderItems;
module.exports.getMenu = getMenu;
module.exports.getRestDetailsByOwnerEmail = getRestDetailsByOwnerEmail;
module.exports.updateDetails = updateDetails;
module.exports.getRestDetailsByRestId = getRestDetailsByRestId;
module.exports.getPastOrders = getPastOrders;