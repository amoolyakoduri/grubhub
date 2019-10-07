const express = require('express');
const stack = require('./Stack');
const app = express();
const port = 3002;

var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'))

app.get('/', (req,res) => res.status(200).send("Select operator!") );

app.listen(port, () => console.log(`Calculator app listening on port ${port}!`));

app.post('/add', (req,res) => {
    let val1 = parseInt(req.body.val1);
    let val2 = parseInt(req.body.val2);
    let result = 0;
    if(typeof val1 == "number" && typeof val2 == "number" ) {
        result = val1+val2;
    }
    console.log(result);
    res.status(200).send({result:result});
} )

app.post('/subtract', (req,res) => {
    let val1 = parseInt(req.body.val1);
    let val2 = parseInt(req.body.val2);
    let result = 0;
    if(typeof val1 == "number" && typeof val2 == "number" ) {
        result = val1-val2;
    }
    res.status(200).send({result: result});
} )

app.post('/multiply', (req,res) => {
    let val1 = parseInt(req.body.val1);
    let val2 = parseInt(req.body.val2);
    let result = 0;
    if(typeof val1 == "number" && typeof val2 == "number" ) {
        result = val1*val2;
    }
    res.status(200).send({result:result});
} )

app.post('/divide', (req,res) => {
    let val1 = parseInt(req.body.val1);
    let val2 = parseInt(req.body.val2);
    let result = null;
    if(typeof val1 == "number" && typeof val2 == "number" )  {
        if(val2!=0 )
         result = val1/val2 
         else
         result = "denominator cannot be zero"
    }
    res.status(200).send({result:result});
} )