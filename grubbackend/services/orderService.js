const orderSchema = require('./../models/orders').Order;

var getOrders = (restId,status) => {
    return new Promise(function(resolve,reject) {
        orderSchema.find({_restaurant_id : restId, status : status==null ? status : any},function(err,results){   
        if(error) {
                console.log("Error in getOrders");
                reject("Error");
            } else {
                console.log("Orders for restId ",restId," are : ",results);
                resolve(results);
            }
        })
    })
}

var updateOrderStatus = (orderId,status) => {
    return new Promise(function(resolve,reject) {
        orderSchema.update({_order_id : orderId }, {status : status}, function(err,results){
        if(error) {
                console.log("Error in updateOrderStatus");
                reject("Error");
            } else {
                console.log("Updated Status!");
                resolve(results);
            }
        })
    })
}


var placeOrder = (restId,emailId,orderItems,deliveryDetails) => {
    return new Promise(function(resolve,reject) {
        var amt = 0;
        var status = 1;
        var orderId ;
        const promise = orderItems.map( (orderItem) => {
            amt = amt + (orderItem.quantity * orderItem.price);
        })
        Promise.resolve(promise).then( () => {
            orderInstance = new orderSchema({"amt":amt,"address":deliveryDetails.address,"name":deliveryDetails.name,
        "emailId": emailId, "restaurant": restId,"status":"New","order_items":orderItems});
        orderInstance.save(function(err,results){
            if(error) {
                console.log("Error in placeOrder");
                reject("error");
            } else {
                console.log("Order placed ");
                resolve(results[0]);
            }
        })
        })
    })
}

module.exports.updateOrderStatus = updateOrderStatus;
module.exports.getOrders = getOrders;
module.exports.placeOrder  = placeOrder;

