'use strict';
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var auth = require('./../services/authenticationService');
var passport  = require('passport');

module.exports = function (passport) {
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "Passphrase for encryption should be 45-50 char long"
    };
    passport.use(new JwtStrategy(opts, function (jwt_payload, callback) {
        auth.findUser( jwt_payload.email)
        .then((user)=>{callback(null,user)})
        .catch((err)=>{callback(err,false)})
    }));
};