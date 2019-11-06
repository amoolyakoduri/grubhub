const routes = require('express').Router();
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var passport = require('passport');
var jwt = require('jsonwebtoken');
require('./../config/passport')(passport);
const secret_key = "Passphrase for encryption should be 45-50 char long";
var requireAuth = passport.authenticate('jwt', { session: false });
var kafka = require('./../kafka/client');


routes.post('/addSection', requireAuth, (req, res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var body = {
        msg: "AddSection",
        payload: {
            ownerEmail: ownerEmail,
            section: req.body.section,
        }
    }
    kafka.make_request('GRest', body, function (err, results) {
        if (err) {
            res.status(500).json({ success: false, message: err.message, payload: null });
        } else {
            res.status(200).json({ success: true, message: "Section added!", payload: null });
        }
    })
})


routes.post('/deleteSection', requireAuth, (req, res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var body = {
        msg: "DeleteSection",
        payload: {
            ownerEmail: ownerEmail,
            section: req.body.section,
        }
    }
    if (body.payload.section == undefined) {
        res.status(500).json({ success: false, message: "Section missing", payload: null });
    } else {
        kafka.make_request('GRest', body, function (err, results) {
            if (err) {
                res.status(500).json({ success: false, message: err.message, payload: null });
            } else {
                res.status(200).json({ success: true, message: "Section deleted!", payload: null });
            }
        })
    }
})



routes.post('/addItem', upload.single('pic'), (req, res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var body = {
        msg: "AddItem",
        payload: {
            ownerEmail: ownerEmail,
            section: req.body.section,
            price: req.body.price,
            desc: req.body.desc,
            name: req.body.name,
            pic: req.file.path
        }
    }
    if (body.payload.section == undefined) {
        res.status(500).json({ success: false, message: "Section missing", payload: null });
    } else {
        kafka.make_request('GRest', body, function (err, results) {
            if (err) {
                res.status(500).json({ success: false, message: err.message, payload: null });
            } else {
                res.status(200).json({ success: true, message: "Item added!", payload: null });
            }
        })
    }
})



routes.post('/deleteItem', requireAuth, (req, res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var ownerEmail = payload.email;
    var body = {
        msg: "DeleteItem",
        payload: {
            ownerEmail: ownerEmail,
            section: req.body.section,
            itemName: req.body.name
        }
    }
    if (body.payload.section === undefined || body.payload.itemName == undefined) {
        res.status(500).json({ success: false, message: "Section or name missing", payload: null });
    } else {
        kafka.make_request('GRest', body, function (err, results) {
            if (err) {
                res.status(500).json({ success: false, message: err.message, payload: null });
            } else {
                res.status(200).json({ success: true, message: "Item deleted!", payload: null });
            }
        })
    }
})



routes.get('/getOrders/:restName', requireAuth, (req, res) => {
    var body = {
        msg: "GetOrdersByRestName",
        payload: {
            restName: req.params.restName
        }
    }
    if (body.payload.restName == undefined) {
        res.status(400).json({ success: false, message: "Rest Name undefined", payload: null });
    } else {
        kafka.make_request('GOrders', body, function (err, results) {
            if (err) {
                res.status(500).json({ success: false, message: err.message, payload: null });
            } else {
                if (results.length != 0)
                    res.status(200).json({ success: true, message: "Orders fetched", payload: results });
                else
                    res.status(200).json({ success: true, message: "No orders", payload: null })
            }
        })
    }
})



routes.get('/getPastOrders/:restName', requireAuth, (req, res) => {
    var body = {
        msg: "GetPastOrdersByRestName",
        payload: {
            restName: req.params.restName
        }
    }
    if (body.payload.restName == undefined) {
        res.status(400).json({ success: false, message: "Rest Name undefined", payload: null });
    } else {
        kafka.make_request('GOrders', body, function (err, results) {
            if (err) {
                res.status(500).json({ success: false, message: err.message, payload: null });
            } else {
                if (results.length != 0)
                    res.status(200).json({ success: true, message: "Orders fetched", payload: results });
                else
                    res.status(200).json({ success: true, message: "No orders", payload: null })
            }
        })
    }
})



routes.post('/updateOrder', requireAuth, (req, res) => {
    var body = {
        msg: "UpdateOrder",
        payload: {
            orderId: req.body.orderId,
            status: req.body.status
        }
    }
    if (body.payload.orderId == undefined || body.payload.status == undefined) {
        res.status(500).json({ success: false, message: "Status or order id undefined", payload: null });
    } else {
        kafka.make_request('GOrders', body, function (err, results) {
            if (err) {
                res.status(500).json({ success: false, message: err.message, payload: null });
            } else {
                console.log(results);
                res.status(200).json({ status: true, message: "Updated status", payload: null });
            }
        })
    }
})



routes.get('/getRestDetails/:ownerEmail', requireAuth, (req, res) => {
    var body = {
        msg: "GetRestDetailsByOwnerEmail",
        payload: {
            ownerEmail: req.params.ownerEmail
        }
    }
    kafka.make_request('GRest', body, function (err, results) {
        if (err) {
            res.status(400).json({ success: false, message: err.message, payload: null });
        } else {
            res.status(200).json({ success: true, message: "Fetching Rest Details", payload: results });
        }
    })
});



routes.post('/getOrdersByStatus', requireAuth, (req, res) => {
    var body = {
        msg: "GetOrdersByStatus",
        payload: {
            restName: req.body.restName,
            status: req.body.status
        }
    }
    if (body.payload.status == undefined || body.payload.restName == undefined) {
        res.status(500).json({ success: false, message: "Status or rest name undefined", payload: null });
    } else {
        kafka.make_request('GOrders', body, function (err, results) {
            if (err) {
                res.status(500).json({ success: false, message: err.message, payload: null });
            } else {
                res.status(200).json({ success: true, message: "Fetching orders", payload: { orders: results } });
            }
        })
    }
})



routes.post('/updateRestDetails', requireAuth, (req, res) => {
    var token = req.headers.authorization.substr(7);
    var payload = jwt.verify(token, secret_key);
    var emailId = payload.email;
    var restDetails = {
        ownerEmail: emailId,
        zipcode: req.body.restDetails.zip,
        phone: req.body.restDetails.phone,
        cuisine: req.body.restDetails.cuisine,
        address: req.body.restDetails.address
    }
    var body = {
        msg: "UpdateRestDetails",
        payload: {
            restDetails: restDetails
        }
    }
    kafka.make_request('GRest', body, function (err, results) {
        if (err) {
            res.status(400).json({ success: false, message: err.message, payload: null })
        } else {
            res.status(200).json({ success: true, message: "Updated rest details", payload: results });
        }
    })
})


module.exports.routes = routes;
