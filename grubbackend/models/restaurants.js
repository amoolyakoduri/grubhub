var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    _item_id : Schema.Types.ObjectId,
        name : {
            type : String,
            required : true,
            unique : true
        },
        descr : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        } 
})

MenuSchema.pre('validate',function(next){
    next();
})

MenuSchema.pre('save',function(next){
    next();
})


const SectionSchema = new Schema({
    _section_id : Schema.Types.ObjectId,
    name : {
        type : String,
        required : true,
        unique : true
    },
    menu : [MenuSchema]
})

SectionSchema.pre('validate',function(next){
    next();
})

SectionSchema.pre('save',function(next){
    next();
})


const RestaurantSchema = new Schema({
    _restaurant_id : Schema.Types.ObjectId,
    name : {
        type : String,
        required : true
    }, 
    zip : {
        type : String,
        required : true
    } , 
    phone : {
        type : String,
        required : true
    } , 
    cuisine : {
        type : String,
        required : true
    } , 
    address : {
        type : String,
        required : true
    } , 
    ownerEmail : {
        type : String,
        required : true
    } ,
    displayPic : {
        type : String,
        required : true
    } ,
    sections : [ SectionSchema],
})

RestaurantSchema.pre('validate',function(next){
    next();
})

RestaurantSchema.pre('save',function(next){
    next();
})


module.exports.Restaurant = mongoose.model('Restaurant',RestaurantSchema);;
module.exports.Menu = mongoose.model('Menu',MenuSchema);
module.exports.Section = mongoose.model('Section',SectionSchema);
