const routes = require('express').Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var passport = require('passport');
var jwt = require('jsonwebtoken');
require('./../config/passport')(passport);
const secret_key = "Passphrase for encryption should be 45-50 char long";
var requireAuth = passport.authenticate('jwt', {session: false});
var kafka = require('./../kafka/client');


routes.get('/logout', (req, res) => {
    res.status(200).json({})
})

routes.post('/login',(req,res) => {
    var body = {
        msg : "Login",
        payload : {
            email : req.body.emailId,
            password : req.body.password
        }
    }
    kafka.make_request('GAuth', body, function(err,results){
        console.log(" res is ",results);
        if(err){
            console.log("Couldnt login");
            res.status(401).json({success:false,message:err.message,payload:null});
        } else {
            if(results.length!=0){
                var token = jwt.sign({email:req.body.emailId}, secret_key, {
                    expiresIn: 10080 }); 
                res.status(200).json({success:true, message:"Login Successful",payload:results[0].userDetails,token: 'JWT ' + token});    
            } else {
                res.status(401).json({success:false,message:"Invalid Credentials",payload:null});
            }
        }
        
    });
})


routes.post('/signUp', upload.single('displayPic'), (req,res) => {
    var userDetails = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        address : req.body.address,
        phone : req.body.phone,
        displayPic : req.file.path,
        userType : req.body.userType,
        emailId : req.body.emailId
    }
    var body = {
        msg : "SignUp",
        payload : {
            email : req.body.emailId,
            password : req.body.password,
            userDetails : userDetails
        }
    }
    kafka.make_request('GAuth', body, function(err,results){
        if(err){
            res.status(500).json({success:false,message:err.message,payload:null});
        } else {
            res.status(200).json({success:true,message:"User successfully created",payload:null});
        }
    })
})


routes.post('/registerRestaurant',upload.single('displayPic'),(req,res) => {
    var body = {
        msg : "CreateRestaurant",
        payload : {
            name : req.body.name,
            zip : req.body.zipcode,
            phone : req.body.phone,
            cuisine : req.body.cuisine,
            address : req.body.address,
            ownerEmail : req.body.emailId,
            displayPic : req.file.path,
        }
    }
    kafka.make_request('GAuth', body, function(err,results){
        if(err){
            res.status(500).json({success:false,message:err.message,payload:null})
        } else {
            res.status(200).json({success:true,message:"Restaurant successfully registered!",payload:null});
        }
    })
});



routes.post('/addSection',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var body = {
        msg : "AddSection",
        payload : {
            ownerEmail : ownerEmail,
            section : req.body.section,
        }
    }
    kafka.make_request('GRest', body, function(err,results){
        if(err){
            res.status(500).json({success:false,message:err.message,payload:null});
        } else {
            res.status(200).json({success:true,message:"Section added!",payload:null});
        }
    })
})

routes.post('/deleteSection',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var body = {
        msg : "DeleteSection",
        payload : {
            ownerEmail : ownerEmail,
            section : req.body.section,
        }
    }
    if(body.payload.section == undefined ){
        res.status(500).json({success:false,message:"Section missing",payload:null});
    } else {
        kafka.make_request('GRest', body, function(err,results){
            if(err){
                res.status(500).json({success:false,message:err.message,payload:null});
            } else {
                res.status(200).json({success:true,message:"Section deleted!",payload:null});
            }
        })
    }
})

routes.post('/addItem',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var body = {
        msg : "AddItem",
        payload : {
            ownerEmail : ownerEmail,
            section : req.body.section,
            price : req.body.price,
            desc : req.body.desc,
            name : req.body.name
        }
    }
    if(body.payload.section == undefined ){
        res.status(500).json({success:false,message:"Section missing",payload:null});
    } else {
        kafka.make_request('GRest', body, function(err,results){
            if(err){
                res.status(500).json({success:false,message:err.message,payload:null});
            } else {
                res.status(200).json({success:true,message:"Item added!",payload:null});
            }
        })
    }
})

routes.post('/deleteItem',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var body = {
        msg : "DeleteItem",
        payload : {
            ownerEmail : ownerEmail,
            section : req.body.section,
            itemName : req.body.name
        }
    }
    if(body.payload.section === undefined || body.payload.itemName == undefined){
        res.status(500).json({success:false,message:"Section or name missing",payload:null});
    } else {
        kafka.make_request('GRest', body, function(err,results){
            if(err){
                res.status(500).json({success:false,message:err.message,payload:null});
            } else {
                res.status(200).json({success:true,message:"Item deleted!",payload:null});
            }
        })
    }
})

routes.get('/getOrders/:restName',requireAuth,(req,res) => {
    var body = {
        msg : "GetOrdersByRestName",
        payload : {
            restName : req.params.restName
        }
    }
    if(body.payload.restName == undefined){
        res.status(400).json({success:false,message:"Rest Name undefined",payload:null});
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                res.status(500).json({success:false,message:err.message,payload:null});
            } else {
                if(results.length != 0)
                res.status(200).json({success:true,message:"Orders fetched",payload: results});
                else
                res.status(200).json({success:true, message:"No orders", payload:null})            }
        })
    }
})

routes.get('/getPastOrders/:restName',requireAuth,(req,res) => {
    var body = {
        msg : "GetPastOrdersByRestName",
        payload : {
            restName : req.params.restName
        }
    }
    if(body.payload.restName == undefined){
        res.status(400).json({success:false,message:"Rest Name undefined",payload:null});
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                res.status(500).json({success:false,message:err.message,payload:null});
            } else {
                if(results.length != 0)
                    res.status(200).json({success:true,message:"Orders fetched",payload:results});
                else
                    res.status(200).json({success:true, message:"No orders", payload:null})
            }
        })
    }
})

routes.post('/updateOrder',requireAuth,(req,res) => {
    var body = {
        msg : "UpdateOrder",
        payload : {
            orderId : req.body.orderId,
            status : req.body.status
        }
    }
    if(body.payload.orderId == undefined || body.payload.status == undefined) {
        res.status(500).json({success:false,message:"Status or order id undefined",payload:null});
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                res.status(500).json({success:false,message:err.message,payload:null});
            } else {
                console.log(results);
                res.status(200).json({status:true,message:"Updated status",payload:null});
            }
        })
    }
})

routes.post('/getOrdersByStatus',requireAuth,(req,res) => {
    var body = {
        msg : "GetOrdersByStatus",
        payload : {
            restName : req.body.restName,
            status : req.body.status
        }
    }
    if(body.payload.status == undefined || body.payload.restName == undefined){
        res.status(500).json({success:false,message:"Status or rest name undefined",payload:null});
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                res.status(500).json({success:false,message:err.message,payload:null});
            } else {        
                res.status(200).json({success:true,message:"Fetching orders",payload:{orders:results}});
            }
        })
    }
})

var sendMessage = (data) => {
    var body = {
        msg : "SendMessage",
        payload : {
            text : data.text,
            senderId : data.senderId,
            orderId : data.orderId
        }
    }
    var response = null
    if(body.payload.senderId == undefined || body.payload.orderId == undefined){
        response = { success: false,message : "senderId or orderId undefined",payload:null}
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                response = { success: false,message :err.message,payload:null}
            } else {        
                response = { success: true,message : "message sent",payload:data}
            }
        })
    }
    return response;
}

routes.get('./getChat/:orderId',requireAuth,(req,res) => {
    var body = {
        msg : "GetChat",
        payload : {
            orderId : req.params.orderId
        }
    }
    if(body.payload.orderId == undefined){
        res.status(400).json({success:false,message:"OrderId undefined",payload:null});
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                res.status(500).json({success:false,message:err.message,payload:null});
            } else {        
                res.status(200).json({success:true,message:"Fetching chat",payload:results});
            }
        })
    }
})

// routes.get('/getOrderItems/:id',requireAuth,(req,res) => {
//     var orderId = req.params.id;
//     restService.getOrderItems(orderId)
//     .then( (response) => {
//         res.status(200).json({payload:response,message:"Fetching items for this order"});
//     }).catch( (error) => {
//         console.log("Error");
//         res.status(500).json({payload:null,message:"Couldnt fetch items for this order"});
//     })
// })

routes.get('/getRestDetails/:ownerEmail',requireAuth,(req,res) => {
    var body = {
        msg : "GetRestDetailsByOwnerEmail",
        payload : {
            ownerEmail : req.params.ownerEmail
        }
    }
    kafka.make_request('GRest', body, function(err,results){
        if(err){
            res.status(400).json({success:false,message:err.message,payload:null});
        } else {        
            res.status(200).json({success:true,message:"Fetching Rest Details",payload:results});
        }
    })
});

routes.get('/getRestaurants',requireAuth,(req,res) => {
    var body = {
        msg : "GetRestaurants",
        payload : {}
    }
    kafka.make_request('GRest', body, function(err,results){
        if(err){
            res.status(500).json({success:false,message:err.message,payload:null});
        } else {        
            res.status(200).json({success:true,message:"Fetching restaurants",payload : results});
        }
    })
})


routes.get('/getUserDetails/:email',requireAuth,(req,res) => {
    var body = {
        msg : "GetUserDetails",
        payload : {
            email : req.params.email
        }
    }
    kafka.make_request('GUsers', body, function(err,results){
        if(err){
            console.log("Couldnt get user details");
            res.status(400).json({success:false,message:err.message,payload:null});
        } else {
            if(results.length!=0){
                res.status(200).json({success:true,message:"Fetching user details",payload: results[0].userDetails});
            } else {
                res.status(200).json({success:true,message:"Invalid user email",payload: null});
            }        }
    })
})

routes.post( '/updatePassword',requireAuth,(req,res)=> {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var emailId = payload.email;
    var body = {
        msg : "UpdatePassword",
        payload : {
            email : emailId,
            oldPassword : req.body.oldPassword,
            newPassword : req.body.newPassword
        }
    }
    kafka.make_request('GUsers', body, function(err,results){
        if(err){
            res.status(500).json({success:false,message:err.message,payload:null});
        } else {        
            if(results.nModified===1){
                res.status(200).json({success:true,message:"Password Updated",payload:results});
                } else {
                    res.status(500).json({success:false,message:"Invalid password",payload:null});
                }
        }
    })
})


routes.post('/placeOrder',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key)
    var body = {
        msg : "PlaceOrder",
        payload : {
            email : payload.email,
            restName : req.body.restName,
            orderItems : req.body.orderItems,
            deliveryDetails : req.body.deliveryDetails,
            restPic : req.body.restPic        
        }
    }
    if(body.payload.restName == undefined || body.payload.orderItems == undefined || body.payload.deliveryDetails == undefined){
        res.status(500).json({success:false, message:"rest name or order items or delivery details undefined",payload:null});
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                res.status(500).json({success:false, message:err.message,payload:null});
            } else {
                res.status(200).json({success:true,message:"Order Placed",payload:null});
            }
        })
    }
})

routes.get('/pastOrders/:emailId',requireAuth,(req,res) => {
    var body = {
        msg : "PastOrdersByBuyerEmail",
        payload : {
            email : req.params.emailId
        }
    }
    if(body.payload.email == undefined){
        res.status(400).json({success:false,message:"Email id undefined",payload:null});
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                res.status(400).json({success:false,message:err.message,payload:null});
            } else {
                res.status(200).json({success:true,message:"Fetching past orders",payload: results});
            }
        })
    }
})

routes.get('/upcomingOrders/:emailId',requireAuth,(req,res) => {
    var body = {
        msg : "UpcomingOrdersByBuyerEmail",
        payload : {
            email : req.params.emailId
        }
    }
    if(body.payload.email == undefined){
        res.status(400).json({success:false,message:"Email id undefined",payload:null});
    } else {
        kafka.make_request('GOrders', body, function(err,results){
            if(err){
                res.status(400).json({success:false,message:err.message,payload:null});
            } else {
                res.status(200).json({success:true,message:"Fetching upcoming orders",payload: results});
            }
        })
    }
})
 
routes.post('/updateDetails',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var emailId = payload.email;
    var body = {
        msg : "UpdateDetails",
        payload : {
            email : emailId,
            userDetails : req.body.userDetails,
        }
    }
    kafka.make_request('GUsers', body, function(err,results){
        if(err){
            res.status(400).json({success:false,message:err.message,payload:null});
        } else {
            const updatedUser = Object.assign({}, body.payload.existingDetails, body.payload.user);
            res.status(200).json({success:true,message:"Updated details",payload:updatedUser});
        }
    })
})


routes.get('/getRestDetailsByRestName/:restName',requireAuth,(req,res) => {
    var body = {
        msg : "GetRestDetailsByRestName",
        payload : {
            restName : req.params.restName
        }
    }
    kafka.make_request('GRest', body, function(err,results){
        if(err){
            res.status(400).json({success:false,message:err.message,payload:null});
        } else {
            res.status(200).json({success:true,message:"Fetching Rest Details",payload:results});
        }
    })
});


routes.post('/updateRestDetails',requireAuth,(req,res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var emailId = payload.email;
    var restDetails = {
        ownerEmail : emailId,
        zipcode : req.body.restDetails.zip,
        phone : req.body.restDetails.phone,
        cuisine : req.body.restDetails.cuisine,
        address : req.body.restDetails.address
    }
    var body = {
        msg : "UpdateRestDetails",
        payload : {
            restDetails : restDetails
        }
    }
    kafka.make_request('GRest', body, function(err,results){
        if(err){
            res.status(400).json({success:false,message:err.message,payload:null})
        } else {
            res.status(200).json({success:true,message:"Updated rest details",payload:results});
        }
    })
})

routes.post('/search',requireAuth,(req,res) => {
    var body = {
        msg : "Search",
        payload : {
            name : req.body.name,
            item : req.body.item,
            cuisine : req.body.cuisine
        }
    }
    kafka.make_request('GRest', body, function(err,results){
        if(err){
            res.status(400).json({success:false,message:err.message,payload:null});
        } else {
            res.status(200).json({success:true,message:"Fetching search results",payload:results});
        }
    })
})

routes.post('/book', function(req, res){

    kafka.make_request('post_book',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                res.json({
                    updatedList:results
                });

                res.end();
            }
        
    });
});

module.exports.routes = routes;
module.exports.sendMessage = sendMessage;