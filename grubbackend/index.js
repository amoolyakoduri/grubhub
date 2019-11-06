
const express = require('express');

const app = express();

const port = 3003;

var cors = require('cors');

var routes = require('./routes/index').routes;

var sendMessage = require('./routes/index').sendMessage;

var bodyParser = require('body-parser');

var passport = require('passport');

require('./config/passport')(passport);

//// Socket IO Code

var http = require('http').Server(app);

var io = require('socket.io')(http);

io.on('connection', function (socket) {
  console.log('A user connected');
  socket.on('peer-msg', function (data) {
    sendMessage(data)
    io.sockets.emit('newmsg', data)
  })

  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

http.listen(port, function () {
  console.log('listening on *:3000');
});

//// Socket IO Code ends

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(cors({ origin: 'http://3.134.117.20:3001', credentials: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://3.134.117.20:3001');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use(express.static('public'))

app.use('/uploads', express.static('uploads'));

app.use('/api', routes);


process.on('unhandledRejection', (reason, p) => {
  console.log(reason);
  throw reason;
});

process.on('uncaughtException', (error) => {
  console.log(error);
});
