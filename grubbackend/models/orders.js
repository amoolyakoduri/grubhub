var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
        _order_id : Schema.Types.ObjectId,
        name : String,
        address : String,
        amt : Number,
        emailId : String,
        _restaurant_id : String,
        status : String,
        order_items : [ new Schema ({
            order_item_id : Schema.Types.ObjectId,
            item_id : String,
            name : String,
            price : Number,
            quantity : Number
        })],
        chat : [ new Schema ({
            message : String,
            from : String
        },{ timestamps: { createdAt: 'created_at' } })
        ] 
})

var Order = mongoose.model('Order',OrderSchema);

module.exports.Order = Order;