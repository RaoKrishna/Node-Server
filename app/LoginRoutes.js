/**
 * Created by Krishna Rao on 3/23/2016.
 */

var express = require('express');
var loginRouter = express.Router();
//var sql = require('mssql');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var privateKey = fs.readFileSync('./privatekey.key', 'utf8');

var router = function() {

    loginRouter.route('/')
        .post(function(req, res){
            var users = [
                {
                    username: 'ksr',
                    password: 'abc',
                    role: 'Professor'
                },
                {
                    username: 'def',
                    password: '123',
                    role: 'Student'
                }
            ];

            var role = null;
            var isAuthenticated = users.reduce((isAuth, user) => {
                if(user.username == req.body.uname && user.password == req.body.pwd) {
                    isAuth = true;
                    role = user.role;
                }
                return isAuth;
            }, false);

            if(isAuthenticated) {
                var token = jwt.sign({userDetails: req.body.uname + ":::" + role}, privateKey, {algorithm: 'RS256', expiresIn: "1d"});
                res.status(200).json({token: token})
            } else {
                res.sendStatus(401);
            }
            /*var request = new sql.Request();
            request.input("username", sql.NVarChar(50), req.body.uname);
            request.input("password", sql.NVarChar(50), req.body.pwd);
            request.output("usercount", sql.Int);
            request.execute('[dbo].[AuthenticateUser]', function(err, data) {
                if(err) {
                    console.log(err);
                } else {
                    if(request.parameters.usercount.value == 1) {
                        var token = jwt.sign(req.body.uname, privateKey, {algorithm: 'RS256', expiresIn: "1d"});
                        res.status(200).json({token: token})
                    } else {
                        res.sendStatus(401);
                    }
                }
            });*/
        });

    return loginRouter;
};

module.exports = router;