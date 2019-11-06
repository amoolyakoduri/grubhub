var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    _restaurant_id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    ownerEmail: {
        type: String,
        required: true
    },
    displayPic: {
        type: String,
        required: true
    },
    sections: {
        type: [{
            name: {
                type: String,
                required: true,
                unique: true,
                index: true,
                sparse: true,
                default: null,
                trim: true,
            },
            menu: [{
                name: {
                    type: String,
                    required: true,
                    unique: true,
                    index: true,
                    default: null,
                    trim: true,
                    sparse: true
                },
                descr: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                pic: {
                    type: String,
                    required: true
                }
            }]
        }],
        required: false
    }
})



module.exports.Restaurant = mongoose.model('Restaurant', RestaurantSchema);
