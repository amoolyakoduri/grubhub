const routes = require('express').Router();
const auth = require('../services/authenticationService');
const userService = require('./../services/userService');
const restService = require('./../services/restaurantService');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var message = require('./../services/messageService');
var passport = require('passport');
var jwt = require('jsonwebtoken');
//var jwtStrategy = require('./../config/passport');
//passport.use(jwtStrategy);
require('./../config/passport')(passport);
var requireAuth = passport.authenticate('jwt', {session: false});

routes.get('/logout', (req, res) => {
    res.status(200).json({})
})

routes.post('/login',(req,res) => {
    var email = req.body.emailId;
    var password = req.body.password;
    var payload ;
    auth.authenticate(email,password)
    .then( (response) => {
        var token = jwt.sign({email:email}, "Passphrase for encryption should be 45-50 char long", {
            expiresIn: 10080 // in seconds
        });
        userService.getUserDetails(email)
        .then( (myJson) => {
            payload = Object.assign({},myJson);
            
            if(payload.type==="owner") {
                restService.getRestDetailsByOwnerEmail(email)
                .then( (results) => {
                    if(results) {
                        payload["restDetails"] = results;
                        restService.getMenu(results.id)
                        .then( (resultSection) => {
                            payload.restDetails["sections"]=resultSection;
                            req.session.user = payload;
                            res.cookie('loggedIn', true, { maxAge: 600000*5 });
                            res.status(200).json({message:"Login Successful",payload:payload,token: 'JWT ' + token});
                        })
                    } else {
                        res.status(200).json({message:"Login Successful",payload:payload,token: 'JWT ' + token}); 
                    }
                })
            } else {
                res.status(200).json({message:"Login Successful",payload:payload});
            }
        })
    }).catch( (error) => {
        console.log("Couldnt login");
        res.status(400).json({payload:null,message:"Login failed!"});
    })
})

routes.get('/getUserDetails/:email',requireAuth,(req,res) => {
    var email = req.params.email;
    userService.getUserDetails(email) 
    .then((response) => {
        console.log("User details : ",response);
        res.status(200).json({userDetails: response});
    }).catch((error) => {
        console.log("Couldnt get user details");
        res.status(400).json({message:"Couldnt fetch user details"});
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
        userType : req.body.type
    }
    auth.createAccount(email,password,firstName,lastName,type,req.file.path)
    .then( (response) => {
        userService.getUserDetails(email)
        .then( (myJson) => {
            payload = Object.assign({},myJson);
            req.session.user = payload;
            res.cookie('loggedIn', true, { maxAge: 600000*5 });
            if(type == "buyer") {
                userService.pastOrders(email)
                .then( (results) => {
                    console.log("past orders are ",results );
                    payload["pastOrders"] = results;
                    res.status(200).json({payload:payload});
                }).catch( (err) => {
                    res.status(400).json({message:"Registration unsuccessful!"});
                })
            } else {
            res.status(200).json({payload:payload});
            }
    }).catch( (error) => {
        console.log("Couldnt login");
        res.status(400).json({message:"Login failed!"});
    })
})
})

routes.post('/register',upload.single('displayPic'),(req,res) => {
    console.log("in register");
    var name = req.body.name;
    var zipcode = req.body.zipcode;
    var phone = req.body.phone;
    var cuisine = req.body.cuisine;
    var address = req.body.address;
    var email = req.body.emailId;
    auth.createRestaurant(name,phone,cuisine,address,zipcode,email,req.file.path)
    .then( (myJson) => {
        console.log(myJson);
        res.status(200).json({payload:myJson,message:"Restaurant registeration successful!"});
    }).catch((err) => {
        res.status(500).json({payload:null,message:"Restaurant registeration unsuccessful!"})
    })
});

routes.post('/addSection',requireAuth,(req,res) => {
    var restId = req.body.restId;
    var section = req.body.section;
    restService.addSection(restId,section)
    .then( (myJson) => {
        console.log("section is ",myJson);
        res.status(200).json({payload:{section:section},message:"Section added!"});
    }).catch((err) => {
        res.status(500).json({payload:null,message:"Section not added"});
    })
})

routes.post('/deleteSection',requireAuth,(req,res) => {
    var restId = req.body.restId;
    var section = req.body.section;
    restService.deleteSection(restId,section)
    .then( (myJson) => {
        console.log(myJson);
        res.status(200).json({payload:myJson,message:"Section deleted!"});
    }).catch((err) => {
        res.status(500).json({payload:null,message:"Section not deleted"});
    })
})

routes.post('/addItem',requireAuth,(req,res) => {
    var restId = req.body.restId;
    var name = req.body.name;
    var desc = req.body.desc;
    var price = req.body.price;
    var section = req.body.section;
    restService.addItem(restId,name,desc,price,section)
    .then((myJson) => {
        console.log(myJson);
        res.status(200).json({payload:{item:name,descr:desc,price:price,id:myJson.insertId},message:"Item added!"});
    }).catch((err) => {
        res.status(500).json({payload:null,message:"Item not added"});
    })
})

routes.post('/deleteItem',requireAuth,(req,res) => {
    var restId = req.body.restId;
    var itemId = req.body.itemId;
    var section = req.body.section;
    restService.deleteItem(restId,itemId,section)
    .then((myJson) => {
        console.log(myJson);
        res.status(200).json({payload:{itemId:itemId},message:"Item deleted!"});
    }).catch((err) => {
        res.status(500).json({payload:null,message:"Item not deleted"});
    })
})

routes.get('/getOrders/:id',requireAuth,(req,res) => {
    var restId = req.params.id;
    restService.getOrders(restId)
    .then((myJson) => {
        console.log("myJson is ",myJson);
        if(myJson.length != 0)
        res.status(200).json({payload:{orders: myJson},message:null});
        else
        res.status(200).json({payload:null,message:"No orders"})
    }).catch( (err) => {
        res.status(500).json({payload:null,message:"Couldnt fetch orders"});
    })
})

routes.get('/getPastOrders/:id',requireAuth,(req,res) => {
    var restId = req.params.id;
    restService.getPastOrders(restId)
    .then((myJson) => {
        console.log("myJson is ",myJson);
        if(myJson.length != 0)
        res.status(200).json({payload:{pastOrders: myJson},message:null});
        else
        res.status(200).json({payload:null,message:"No past orders"})
    }).catch( (err) => {
        res.status(500).json({payload:null,message:"Couldnt fetch orders"});
    })
})

routes.post('/updateOrder',requireAuth,(req,res) => {
    var restId = req.body.restId;
    var orderId = req.body.orderId;
    var status = req.body.status;
    restService.updateOrderStatus(restId,orderId,status)
    .then((myJson) => {
        console.log(myJson);
        res.status(200).json({payload:myJson,message:"Updated status"});
    }).catch((err) => {
        res.status(500).json({payload:null,message:"Couldnt update status"});
    })
})

routes.get('/getOrdersByStatus',requireAuth,(req,res) => {
    var restId = req.query.restId;
    var status = req.query.status;
    restService.getOrdersByStatus(restId,status)
    .then((myJson) => {
        console.log(myJson);
        res.status(200).json({orders:myJson});
    }).catch((err) => {
        res.sendStatus(500).json({message:"Couldnt fetch orders"});
    })
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
    var restId = req.body.restId;
    var emailId = req.body.emailId;
    var orderItems = req.body.orderItems;
    var deliveryDetails = req.body.deliveryDetails;
    userService.placeOrder(restId,emailId,orderItems,deliveryDetails)
    .then( (myJson) => {
        console.log("Order Placed");
        res.status(200).json({message:"Order Placed"});
    }).catch((error) => {
        console.log("Order not placed.");
        res.status(500).json({message:"Order not placed"});
    })
})

routes.get('/pastOrders/:emailId',requireAuth,(req,res) => {
    var emailId = req.params.emailId;
    userService.pastOrders(emailId)
    .then( (response) => {
        console.log("Past Orders are : ",response);
        res.status(200).json({payload:response,message:"Fetching past orders."});
    }) .catch( (error) => {
        console.log("Orders not available");
        res.status(400).json({payload:null,message:"Past Order not available"});
    })
})

routes.get('/upcomingOrders/:emailId',requireAuth,(req,res) => {
    var emailId = req.params.emailId;
    userService.upcomingOrders(emailId)
    .then( (response) => {
        console.log("upcoming Orders are : ",response);
        res.status(200).json({payload:response,message:"Fetching upcoming orders."});
    }) .catch( (error) => {
        res.status(400).json({payload:null,message:"No upcoming orders"});
    })
})

routes.get('/getRestaurants',requireAuth,(req,res) => {
    userService.getRestaurants()
    .then( (response) => {
        res.status(200).json({restaurants: response});
    }).catch((error) => {
        console.log("Restaurants not available");
        res.status(400).json({message:"Restaurants not available"});
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

routes.get('/getRestDetails/:id',requireAuth,(req,res) => {
    var restId = req.params.id;
    let payload = {};
    restService.getRestDetailsByRestId(restId)
        .then( (results) => {
            payload["restDetails"] = results;
            restService.getMenu(results.id)
            .then( (resultSection) => {
                payload.restDetails["sections"]=resultSection;
                res.status(200).json({payload:payload,message:"Fetching Rest Details"});
            })
        }).catch( (error) => {
            console.log("Error in getRestDetails");
            res.status(400).json({payload:null,message:"unable to get rest details"});
        })
})

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


routes.post('/createUser',requireAuth,(req,res) => {
    var email = req.body.email;
    var password = req.body.password;
    var userDetails = req.body.userDetails;
    auth.createUser(email,password,userDetails)
    .then( (response) => {
        res.status(200).json({message:"Creating user",payload:response});
    }).catch( (err) => {
        console.log("Error in user api");
        res.status(400).json({message:"Error creating user",payload:null});
    })
})
module.exports = routes;