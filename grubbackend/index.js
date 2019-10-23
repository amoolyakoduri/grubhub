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
// app.use(session({
//     secret: 'grubhub',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false, path: '/', maxAge: 360000 }
//   }));



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
