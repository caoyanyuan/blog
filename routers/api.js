
var express = require('express');
var router = express.Router();
var User = require('../models/User');

var responseData;

router.use(function(req, res, next){
    responseData = {
        code: 0,
        message:''
    }
    next();
})

router.post('/user/register', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;


    if( username == "" ){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);    //转为json数据，然后发给客户端
        return;
    }

    if( password == "" ){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if( password !== repassword){
        responseData.code = 3;
        responseData.message =  '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username
    }).then(function(userInfo){
        if(userInfo) {
            responseData.code = 4;
            responseData.message =  '用户名已经被注册';
            res.json(responseData);
            return;
        }
        //保存用户注册信息到数据库中
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(){
        responseData.message = '注册成功';
        res.json(responseData);
    })

});

router.post('/user/login', function(req, res, next){

    var username = req.body.username;
    var password = req.body.password;

    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(userInfo){
            responseData.message = '登录成功';
            responseData.username = userInfo.username;
            res.json(responseData);
        }
    })

})

module.exports = router;