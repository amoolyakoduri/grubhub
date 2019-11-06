const userSchema = require('./../models/users').User;


function handle_request(body, callback){
   
    console.log("Inside book kafka backend");
    console.log(JSON.stringify(body));
    switch(body.msg){
        case "GetUserDetails" :
            getUserDetails(body.payload)
            .then( (results) => {
               callback(null, results);
               return;
            }).catch( (err) => {
               callback(err.message,null);
               return;
            })
            break;
        case "UpdatePassword" :
            updatePassword(body.payload)
            .then( (results) => {
               callback(null, results);
               return;
            }).catch( (err) => {
               callback(err.message,null);
               return;
            })
            break;
        case "UpdateDetails" :
            updateDetails(body.payload)
            .then( (results) => {
                callback(null, results);
                return;
            }).catch( (err) => {
                callback(err.message,null);
                return;
            })
            break;
        default : 
            defaultFunc(body.payload);
            break;
    }
    console.log("after callback");
};




var getUserDetails = (payload) => {
    return new Promise(function(resolve, reject){
        userSchema.find({
            emailId : payload.email
        }, function(err,results){
            if(err) {
                console.log("error in getUserDetails");
                reject("error");
            } else {
            resolve(results);
            }
        })
})}

var updateDetails = (payload) => {
    return new Promise(function(resolve,reject) {
        const lastName = payload.userDetails.lastName;
        const address = payload.userDetails.address; 
        const phone = payload.userDetails.phone;
        userSchema.update({"emailId":payload.email},{
            "userDetails.lastName" : lastName,
            "userDetails.address" : address,
            "userDetails.phone" : phone
        },function(error,results){
            if(error) {
                console.log("Error in updateDetails ");
                reject(error); 
            } else {
                resolve(results);
            }
        })
    })
}

var updatePassword = (payload) => {
    return new Promise(function(resolve,reject) {
        userSchema.update({"emailId":payload.email,"password":payload.oldPassword},{
            "password" : payload.newPassword
        },function(error,results){
            if(error) {
                console.log("Error in updatePassword");
                reject("error");
            } else {
                resolve(results);
            }
        })
    })
}


var defaultFunc = (payload) => {
    console.log("payload recieved is ",JSON.stringify(payload));
    return;
}


module.exports.handle_request = handle_request;