const routes = require('express').Router();
const auth = require('../services/authenticationService');
const userService = require('./../services/userService');
const restService = require('./../services/restaurantService');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var message = require('./../services/messageService');
var passport = require('passport');
var jwt = require('jsonwebtoken');
require('./../config/passport')(passport);
const secret_key = "Passphrase for encryption should be 45-50 char long";
var requireAuth = passport.authenticate('jwt', {session: false});
var ExtractJwt = require('passport-jwt').ExtractJwt;



routes.get('/logout', (req, res) => {
    res.status(200).json({})
})

routes.post('/login',(req,res) => {
    var email = req.body.emailId;
    var password = req.body.password;
    auth.authenticate(email,password)
    .then( (response) => {
        if(response.length!=0){

            var token = jwt.sign({email:email}, secret_key, {
                expiresIn: 10080 // in seconds
            });
            //req.session.user = response[0].userDetails;
            //res.cookie('loggedIn', true, { maxAge: 600000*5 });
            res.status(200).json({success:true, message:"Login Successful",payload:response[0].userDetails,token: 'JWT ' + token});    
            }
        else {
            res.status(401).json({success:false,message:"Invalid Credentials",payload:null});
        }
    }).catch( (err) => {
        console.log("Couldnt login");
        res.status(401).json({success:false,message:err.message,payload:null});
    })
})

routes.get('/getUserDetails/:email',requireAuth,(req,res) => {
    var email = req.params.email;
    userService.getUserDetails(email) 
    .then((response) => {
        console.log("User details : ",response);
        if(response.length!=0){
            res.status(200).json({success:true,message:"Fetching user details",payload: response[0].userDetails});
        } else {
            res.status(200).json({success:true,message:"Invalid user email",payload: null});
        }
    }).catch((err) => {
        console.log("Couldnt get user details");
        res.status(400).json({success:false,message:err.message,payload:null});
    })
})

routes.post('/signUp', upload.single('displayPic'), (req,res) => {
    console.log("req body is ",req.body);
    var email = req.body.emailId;
    var password = req.body.password;
    var userDetails = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        address : req.body.address,
        phone : req.body.phone,
        displayPic : req.file.path,
        userType : req.body.userType,
        emailId : req.body.emailId
    }
    auth.createUser(email,password,userDetails)
    .then((results) => {
        res.status(200).json({success:true,message:"User successfully created"});
    }).catch( (err) => {
        res.status(500).json({success:false,message:err.message});
    })
})

routes.post('/registerRestaurant',upload.single('displayPic'),(req,res) => {
    console.log("in register");
    var name = req.body.name;
    var zip = req.body.zipcode;
    var phone = req.body.phone;
    var cuisine = req.body.cuisine;
    var address = req.body.address;
    var email = req.body.emailId;
    var displayPic = req.file.path;
    auth.createRestaurant(name,phone,cuisine,address,zip,email,displayPic)
    .then( (results) => {
        console.log(results);
        res.status(200).json({success:true,message:"Restaurant successfully registered!"});
    }).catch((err) => {
        res.status(500).json({success:false,message:err.message})
    })
});



routes.post('/addSection',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var section = req.body.section;
    var ownerEmail = payload.email;
    restService.addSection(ownerEmail,section)
    .then( (response) => {
        res.status(200).json({success:true,message:"Section added!",payload:null});
    }).catch((err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })
})

routes.post('/deleteSection',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var section = req.body.section;
    if(section == undefined ){
        res.status(500).json({success:false,message:"Section missing",payload:null});
    } else {
    restService.deleteSection(ownerEmail,section)
    .then( () => {
        res.status(200).json({success:true,message:"Section deleted!",payload:null});
    }).catch((err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })}
})

routes.get('/getItems/:section',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var section = req.params.section;
    if(section == undefined ){
        res.status(500).json({success:false,message:"Section missing",payload:null});
    } else {

    }
})

routes.post('/addItem',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var name = req.body.name;
    var desc = req.body.desc;
    var price = req.body.price;
    var section = req.body.section;
    if(section == undefined ){
        res.status(500).json({success:false,message:"Section missing",payload:null});
    } else {
    restService.addItem(ownerEmail,name,desc,price,section)
    .then(() => {
        res.status(200).json({success:true,message:"Item added!",payload:null});
    }).catch((err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })}
})

routes.post('/deleteItem',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var itemName = req.body.name;
    var section = req.body.section;
    if(section === undefined || itemName == undefined){
        res.status(500).json({success:false,message:"Section or name missing",payload:null});
    } else {
    restService.deleteItem(ownerEmail,itemName,section)
    .then(() => {
        res.status(200).json({success:true,message:"Item deleted!",payload:null});
    }).catch((err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })
}
})

routes.get('/getOrders/:restName',requireAuth,(req,res) => {
    var restName = req.params.restName;
    restService.getOrders(restName)
    .then((results) => {
        if(results.length != 0)
        res.status(200).json({success:true,message:"Orders fetched",payload: results});
        else
        res.status(200).json({success:true, message:"No orders", payload:null})
    }).catch( (err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })
})

routes.get('/getPastOrders/:restName',requireAuth,(req,res) => {
    var restName = req.params.restName;
    restService.getPastOrders(restName)
    .then((results) => {
        if(results.length != 0)
        res.status(200).json({success:true,message:"Orders fetched",payload:results});
        else
        res.status(200).json({success:true, message:"No orders", payload:null})
    }).catch( (err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })
})

routes.post('/updateOrder',requireAuth,(req,res) => {
    var orderId = req.body.orderId;
    var status = req.body.status;
    if(orderId == undefined || status == undefined) {
        res.status(500).json({success:false,message:"Status or order id undefined",payload:null});
    } else {
    restService.updateOrderStatus(orderId,status)
    .then((myJson) => {
        console.log(myJson);
        res.status(200).json({status:true,message:"Updated status",payload:null});
    }).catch((err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })}
})

routes.post('/getOrdersByStatus',requireAuth,(req,res) => {
    var restName = req.body.restName;
    var status = req.body.status;
    if(status == undefined || restName == undefined){
        res.status(500).json({success:false,message:"Status or rest name undefined",payload:null});
    } else {
    restService.getOrdersByStatus(restName,status)
    .then((results) => {
        res.status(200).json({success:true,message:"Fetching orders",payload:{orders:results}});
    }).catch((err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })}
})

routes.get('/getOrderItems/:id',requireAuth,(req,res) => {
    var orderId = req.params.id;
    restService.getOrderItems(orderId)
    .then( (response) => {
        res.status(200).json({payload:response,message:"Fetching items for this order"});
    }).catch( (error) => {
        console.log("Error");
        res.status(500).json({payload:null,message:"Couldnt fetch items for this order"});
    })
})

routes.post( '/updatePassword',requireAuth,(req,res)=> {
    var email = req.body.emailId;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    userService.updatePassword(email,oldPassword,newPassword)
    .then( (response) => {
        if(response.payload.affectedRows===1){
        res.status(200).json({payload:response,message:"Password Updated"});
        } else {
            res.status(500).json({payload:null,message:"Error in update password"});
        }
    }).catch( (error) => {
        res.status(500).json({payload:null,message:"Error in update password"});
    })
})

routes.post('/placeOrder',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var emailId = payload.email;
    var restName = req.body.restName;
    var orderItems = req.body.orderItems;
    var deliveryDetails = req.body.deliveryDetails;
    var restPic = req.body.restPic
    if(restName == undefined || orderItems == undefined || deliveryDetails == undefined){
        res.status(500).json({success:false, message:"rest name or order items or delivery details undefined",payload:null});
    } else {
    userService.placeOrder(restPic,restName,emailId,orderItems,deliveryDetails)
    .then( () => {
        res.status(200).json({success:true,message:"Order Placed",payload:null});
    }).catch((err) => {
        res.status(500).json({success:false, message:err.message,payload:null});
    })}
})

routes.get('/pastOrders/:emailId',requireAuth,(req,res) => {
    var emailId = req.params.emailId;
    if(emailId == undefined){
        res.status(400).json({success:false,message:"Email id undefined",payload:null});
    } else {
    userService.pastOrders(emailId)
    .then( (results) => {
        res.status(200).json({success:true,message:"Fetching past orders",payload: results});
    }) .catch( (err) => {
        res.status(400).json({success:false,message:err.message,payload:null});
    })}
})

routes.get('/upcomingOrders/:emailId',requireAuth,(req,res) => {
    var emailId = req.params.emailId;
    if(emailId == undefined){
        res.status(400).json({success:false,message:"Email id undefined",payload:null});
    } else {
    userService.upcomingOrders(emailId)
    .then( (results) => {
        res.status(200).json({success:true,message:"Fetching upcoming orders",payload: results});
    }) .catch( (error) => {
        res.status(400).json({success:false,message:err.message,payload:null});
    })}
})

routes.get('/getRestaurants',requireAuth,(req,res) => {
    restService.getRestaurants()
    .then( (response) => {
        res.status(200).json({success:true,message:"Fetching restaurants",payload : response});
    }).catch((err) => {
        res.status(500).json({success:false,message:err.message,payload:null});
    })
})

routes.post('/updateDetails',requireAuth,(req,res) => {
    var user = req.body.user;
    var email = req.body.emailId;
    userService.updateDetails(email,user, req.session.user)
    .then((response) => {
        const updatedUser = Object.assign({}, req.session.user, user);
        console.log('updated User => ', updatedUser);
        req.session.user = updatedUser
        console.log("Updated details are : ",response);
        res.status(200).json({payload:updatedUser,message:"Updated details"});
    }).catch((error) => {
        console.log("Error in update details");
        res.status(400).json({payload:null,message:"unable to update details"});
    })

})

routes.get('/getRestDetails/:ownerEmail',requireAuth,(req,res) => {
    var ownerEmail = req.params.ownerEmail;
    restService.getRestDetailsByOwnerEmail(ownerEmail)
    .then( (results) => {
        res.status(200).json({success:true,message:"Fetching Rest Details",payload:results});
    }).catch( (err) => {
        console.log("Error in getRestDetails");
        res.status(400).json({success:false,message:err.message,payload:null});
    })
});

routes.get('/getRestDetailsByRestName/:restName',requireAuth,(req,res) => {
    var restName = req.params.restName;
    restService.getRestDetailsByRestName(restName)
    .then( (results) => {
        res.status(200).json({success:true,message:"Fetching Rest Details",payload:results});
    }).catch( (err) => {
        console.log("Error in getRestDetails");
        res.status(400).json({success:false,message:err.message,payload:null});
    })
});


routes.post('/updateRestDetails',requireAuth,(req,res) => {
    var restDetails = {
        id : req.body.restId,
        name : req.body.restDetails.name,
        zipcode : req.body.restDetails.zip,
        phone : req.body.restDetails.phone,
        cuisine : req.body.restDetails.cuisine,
        address : req.body.restDetails.address
    }
    restService.updateDetails(restDetails)
    .then( (response) => {
        console.log("Updated rest details are : ",response);
        res.status(200).json({payload:response,message:"Updated rest details"});
    }).catch( (error) => {
        console.log("Error in upadate rest details");
        res.status(400).json({payload:null,message:"unable to update rest details"})
    })
})

routes.post('/search',requireAuth,(req,res) => {
    var name = req.body.name;
    var item = req.body.item;
    var cuisine = req.body.cuisine;
    userService.search(name,item,cuisine)
    .then( (response) => {
        res.status(200).json({message:"Fetching search results",payload:response});
    }).catch( (err) => {
        console.log("Error in search api");
        res.status(400).json({message:"Error Fetching search results",payload:null});
    })
})

routes.get('/check',requireAuth, (req, res)=> {
    message.sendMessage();
    res.status(200).json({});
})


// routes.post('/createUser',requireAuth,(req,res) => {
//     var email = req.body.email;
//     var password = req.body.password;
//     var userDetails = req.body.userDetails;
//     auth.createUser(email,password,userDetails)
//     .then( (response) => {
//         res.status(200).json({message:"Creating user",payload:response});
//     }).catch( (err) => {
//         console.log("Error in user api");
//         res.status(400).json({message:"Error creating user",payload:null});
//     })
// })
module.exports = routes;