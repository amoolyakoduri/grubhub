'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var auth = require('./../services/authenticationService');
var passport  = require('passport');
var kafka = require('./../kafka/client');


module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "Passphrase for encryption should be 45-50 char long"
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        console.log("jwt_payload is ",jwt_payload);
        var body = {
            msg : "FindUser",
            payload : {
                email : jwt_payload.email
            }
        }
        kafka.make_request('GAuth', body, function(err,results){
            if(results!=null){
            if(err){
                callback(err,false);
            } else {
                callback(null,results);
            }
        }
            
        });
    }));

    
};