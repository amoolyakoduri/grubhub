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
});

var User = mongoose.model('User',UserSchema);

module.exports.User = User;