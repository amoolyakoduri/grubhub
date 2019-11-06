const routes = require('express').Router();
var passport = require('passport');
require('./../config/passport')(passport);
var kafka = require('./../kafka/client');
var auth = require('./auth').routes;
var user = require('./user').routes;
var rest = require('./rest').routes;

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/rest', rest);


var sendMessage = (data) => {
    var body = {
        msg: "SendMessage",
        payload: {
            text: data.text,
            senderId: data.senderId,
            orderId: data.orderId
        }
    }
    var response = null
    if (body.payload.senderId == undefined || body.payload.orderId == undefined) {
        response = { success: false, message: "senderId or orderId undefined", payload: null }
    } else {
        kafka.make_request('GOrders', body, function (err, results) {
            if (err) {
                response = { success: false, message: err.message, payload: null }
            } else {
                response = { success: true, message: "message sent", payload: data }
            }
        })
    }
    return response;
}

module.exports.routes = routes;
module.exports.sendMessage = sendMessage;