var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _user_id : Schema.Types.ObjectId,
  emailId: { 
    type :String,
    unique : true,
    required : true
  },
  password: { 
    type :String,
    required : true
  },
  userDetails: {
      firstName : String,
      lastName : String,
      address : String,
      phone : { 
        type :String,
        unique : true,
        required : true
      },
      displayPic : String,
      userType : String
  },
  orders : [new Schema({
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
});

var User = mongoose.model('User',UserSchema);

module.exports.User = User;