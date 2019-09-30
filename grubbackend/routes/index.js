const routes = require('express').Router();
const auth = require('../services/authenticationService');
const userService = require('./../services/userService');
const restService = require('./../services/restaurantService');
//create  an express app

function isLoggedIn(req,res,next){
    console.log("req sess is ",typeof req.session.user," ",req.session.user);
    if(req.session.user.emailId )
    next();
    else throw new Error("not logged in. please login");
}

function getUserFromSession( req ) {
    if(req.session.user)
        return req.session.user;
    return null;
}

routes.get('/getUserDetails', (req, res)=>{
    const userDetails = getUserFromSession(req);
    if(userDetails)
        res.status(200).json({payload: userDetails})
    else
        res.status(404).json({ userDetails: null})
})

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
  });

routes.get('/logout', (req, res) => {
    res.clearCookie('loggedIn');
    res.status(200).json({})
})
routes.post('/login',(req,res) => {
    console.log("in login backend ",req.body);
    var email = req.body.emailId;
    var password = req.body.password;
    var payload ;
    auth.authenticate(email,password)
    .then( (response) => {
        userService.getUserDetails(email)
        .then( (myJson) => {
            payload = Object.assign({},myJson);
            
            if(payload.type==="owner") {
                restService.getRestDetailsByOwnerEmail(email)
                .then( (results) => {
                    payload["restDetails"] = results;
                    restService.getMenu(results.id)
                    .then( (resultSection) => {
                        payload.restDetails["sections"]=resultSection;
                        req.session.user = payload;
                        res.cookie('loggedIn', true, { maxAge: 600000*5 });
                        res.status(200).json({message:"Login Successful",payload:payload});
                    })
                })
            } else {
                res.cookie('loggedIn',true, { maxAge: 600000*5 });
                req.session.user = payload;
                res.status(200).json({message:"Login Successful",payload:payload});
            }
        })
    }).catch( (error) => {
        console.log("Couldnt login");
        res.status(400).json({payload:null,message:"Login failed!"});
    })
})

routes.get('/getUserDetails/:email',(req,res) => {
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

routes.post('/signUp',(req,res) => {
    console.log("req body is ",req.body);
    var email = req.body.emailId;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var type = req.body.type;
    auth.createAccount(email,password,firstName,lastName,type)
    .then( (response) => {
        userService.getUserDetails(email)
        .then( (myJson) => {
            payload = Object.assign({},myJson);
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

routes.post('/register',(req,res) => {
    console.log("in register");
    var name = req.body.name;
    var zipcode = req.body.zipcode;
    var phone = req.body.phone;
    var cuisine = req.body.cuisine;
    var address = req.body.address;
    var email = req.body.emailId;
    auth.createRestaurant(name,phone,cuisine,address,zipcode,email)
    .then( (myJson) => {
        console.log(myJson);
        res.status(200).json({payload:myJson,message:"Restaurant registeration successful!"});
    }).catch((err) => {
        res.status(500).json({payload:null,message:"Restaurant registeration unsuccessful!"})
    })
});

routes.post('/addSection',(req,res) => {
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

routes.post('/deleteSection',(req,res) => {
    var restId = req.body.restId;
    var section = req.body.section;
    restService.deleteSection(restId,section)
    .then( (myJson) => {
        console.log(myJson);
        res.status(200).json({message:"Section deleted!"});
    }).catch((err) => {
        res.status(500).json({message:"Section not deleted"});
    })
})

routes.post('/addItem',(req,res) => {
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

routes.post('/deleteItem',(req,res) => {
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

routes.get('/getOrders/:id',(req,res) => {
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

routes.post('/updateOrder',(req,res) => {
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

routes.get('/getOrdersByStatus',(req,res) => {
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

routes.get('/getOrderItems/:id',(req,res) => {
    var orderId = req.params.id;
    restService.getOrderItems(orderId)
    .then( (response) => {
        console.log(" Order items are : ",response);
        res.status(200).json({payload:response,message:"Fetching items for this order"});
    }).catch( (error) => {
        console.log("Error");
        res.status(500).json({payload:null,message:"Couldnt fetch items for this order"});
    })
})

routes.post('/placeOrder',(req,res) => {
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

routes.get('/pastOrders/:emailId',(req,res) => {
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

routes.get('/upcomingOrders/:emailId',(req,res) => {
    var emailId = req.params.emailId;
    userService.upcomingOrders(emailId)
    .then( (response) => {
        console.log("upcoming Orders are : ",response);
        res.status(200).json({payload:response,message:"Fetching upcoming orders."});
    }) .catch( (error) => {
        res.status(400).json({payload:null,message:"No upcoming orders"});
    })
})

routes.get('/getRestaurants',(req,res) => {
    userService.getRestaurants()
    .then( (response) => {
        console.log("Restaurants are ",response);
        res.status(200).json({restaurants: response});
    }).catch((error) => {
        console.log("Restaurants not available");
        res.status(400).json({message:"Restaurants not available"});
    })
})

routes.post('/updateDetails',(req,res) => {
    var user = req.body.user;
    var email = req.body.emailId;
    userService.updateDetails(email,user)
    .then((response) => {
        console.log("Updated details are : ",response);
        res.status(200).json({payload:response,message:"Updated details"});
    }).catch((error) => {
        console.log("Error in update details");
        res.status(400).json({payload:null,message:"unable to update details"});
    })

})

routes.get('/getRestDetails/:id',(req,res) => {
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

routes.post('/updateRestDetails',(req,res) => {
    var restDetails = {
        id : req.body.restId,
        name : req.body.restDetails.name,
        zipcode : req.body.restDetails.zipcode,
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

routes.post('/search',(req,res) => {
    var name = req.body.name;
    var item = req.body.item;
    var cuisine = req.body.cuisine;
    userService.search(name,item,cuisine)
    .then( (response) => {
        console.log("Fetching search results ",response);
        res.status(200).json({message:"Fetching search results",payload:response});
    }).catch( (err) => {
        console.log("Error in search api");
        res.status(400).json({message:"Error Fetching search results",payload:null});
    })
})

module.exports = routes;