var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
//var sql = require('mssql');
var fs = require('fs');
var https = require('https');
var jwt = require('jsonwebtoken');

var app = express();
var privateKey = fs.readFileSync('./privatekey.key', 'utf8');
var certificate = fs.readFileSync('./certificate.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

// http://stackoverflow.com/questions/21397809/create-a-trusted-self-signed-ssl-cert-for-localhost-for-use-with-express-node

/*var dbConfig = {
    user: 'expenseadmin',
    password: 'ExpenseAppAdmin',
    server: 'localhost\\ExpenseManagerDb', // You can use 'localhost\\instance' to connect to named instance
    database: 'ExpenseAppDB',

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

sql.connect(dbConfig, function(err) {
    if(err) {
        console.log(err);
    }
});*/

var portNo = 5000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://localhost:4000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');

    if ('OPTIONS' == req.method) {
        return res.send(200);
    } else {
        next();
    }
});
/*var expenseRouter = require('../src/ExpenseRoutes')();
app.use('/expense', expenseRouter);

var incomeRouter = require('../src/IncomeRoutes')();
app.use('/income', incomeRouter);

var activityRouter = require('../src/ActivityRoutes')();
app.use('/activities', activityRouter);

var summaryRouter = require('../src/SummaryRoutes')();
app.use('/summary', summaryRouter);


var registerUserRouter = require('../src/RegisterUserRoutes')();
app.use('/register', registerUserRouter);*/

var loginRouter = require('./app/LoginRoutes')();
app.use('/login', loginRouter);

app.get('/', function(req, res) {
    res.json(
        {
            name: 'API',
            age: 2000
        }
    );
});

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(portNo, function(err) {
    console.log(err);
    console.log('Running on port : ' + portNo);
});
