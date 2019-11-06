var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MenuSchema = new Schema({
        name : {
            type : String,
            required : true,
            unique : true,
            index:true,
            default: null,
            trim: true,
            sparse: true
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



const SectionSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        index:true, 
        sparse:true,
        default: null,
        trim: true,
    },
    menu : [MenuSchema]
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
    sections :{
        type : [ SectionSchema],
        required : false
    } 
})



module.exports.Restaurant = mongoose.model('Restaurant',RestaurantSchema);;
module.exports.Menu = mongoose.model('Menu',MenuSchema);
module.exports.Section = mongoose.model('Section',SectionSchema);
