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
        _section_id : Schema.Types.ObjectId,
        name : String,
    })],
    menu : [ new Schema({
        _item_id : Schema.Types.ObjectId,
        name : String,
        descr : String,
        price : String 
    })]

})

var Restaurant = mongoose.model('Restaurant',RestaurantSchema);

module.exports.Restaurant = Restaurant;