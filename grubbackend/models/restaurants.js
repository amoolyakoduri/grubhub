var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    _restaurant_id : Schema.Types.ObjectId,
    name : String, 
    zip : String, 
    phone : String, 
    cuisine : String, 
    address : String, 
    ownerEmail : String,
    displayPic : String,
    sections : [ new Schema({
        name : String,
        menu : [ new Schema({
            _item_id : Schema.Types.ObjectId,
            name : String,
            descr : String,
            price : String 
        })]
    })],
    orders : [ new Schema({
        _order_id : Schema.Types.ObjectId,
        name : String,
        address : String,
        amt : Number,
        emailId : String,
        status : String,
        order_items : [ new Schema ({
            order_item_id : Schema.Types.ObjectId,
            item_id : String,
            quantity : Number
        })]

    })]

})

var Restaurant = mongoose.model('Restaurant',RestaurantSchema);

module.exports.Restaurant = Restaurant;