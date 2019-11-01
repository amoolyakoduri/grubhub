var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderItemsSchema = new Schema ({
    order_item_id : Schema.Types.ObjectId,
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    }
})

const ChatSchema = new Schema ({
    message : {
        type : String,
        required : true
    },
    from : {
        type : String,
        required : true
    }
},{ timestamps: { createdAt: 'created_at' } })


const OrderSchema = new Schema({
        _id : mongoose.Schema.Types.ObjectId,
        name : {
            type : String,
            required : true
        },
        address : {
            type : String,
            required : true
        },
        amt : {
            type : String,
            required : true
        },
        ownerEmail : {
            type : String,
            required : true
        },
        restName : {
            type : String,
            required : true
        },
        status : {
            type : String,
            required : true
        },
        order_items : {
            type : [ OrderItemsSchema],
            required : true },
        chat : [ ChatSchema] 
})

module.exports.Order = mongoose.model('Order',OrderSchema);
module.exports.OrderItems = mongoose.model('OrderItems',OrderItemsSchema);
module.exports.Chat = mongoose.model('Chat',ChatSchema);