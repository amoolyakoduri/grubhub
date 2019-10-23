const express = require('express');
const app = express();
const port = 3003;
var cors = require('cors');
var routes = require('./routes');
var consumers = require('./consumers');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
var session = require('express-session');
const proxy = require('http-proxy-middleware');
var mongoose = require('./database').mongoose;
var passport = require('passport');
var jwt = require('jsonwebtoken');
var mongo = require('mongodb');
var LocalStrategy = require('passport-local').Strategy;
require('./config/passport')(passport);
session(app, mongo.initSessionStore);
var MongoStore  = require('connect-mongo')(session);


app.use(session({
  saveUninitialized: true,
  secret : "Passphrase for encryption should be 45-50 char long",
  resave: true,
  store   : new MongoStore({
    mongooseConnection: mongoose
  })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
app.use(express.static('public'))
app.use('/uploads',express.static('uploads'));
app.use('/api' ,routes);
app.use('/', proxy({
    target: 'http://localhost:3000'
}))
app.listen(port, () => console.log(`Grubhub backend app listening on port ${port}!`));
process.on('unhandledRejection', (reason, p) => {
  // I just caught an unhandled promise rejection, since we already have fallback handler for unhandled errors (see below), let throw and let him handle that
console.log(reason);
  throw reason;
});
process.on('uncaughtException', (error) => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
console.log(error);
});
