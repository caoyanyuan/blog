
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content')


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
        if(!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }

        responseData.message = '登录成功';
        responseData.userInfo = {
            id: userInfo.id,
            username: userInfo.username
        };

        req.cookies.set('userInfo',JSON.stringify({
            id: userInfo.id,
            username: userInfo.username
        }))

        res.json(responseData);
        return;
    })

})

router.get('/user/logout', function(req, res, next) {
    req.cookies.set('userInfo', null);
    res.json(responseData);
});

//提交评论
router.post('/comment/post', function(req, res, next){
    var id = req.body.contentid;
    var comment = req.body.comment;
    if(comment == ""){
        responseData.code = 1;
        responseData.message = '评论不能为空';
        res.json(responseData);
    }

    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: comment
    };

    Content.findOne({_id: id}).then(function(content){
        var cur_comments =  content.comments;
        cur_comments.push(postData);
        content.comments = cur_comments;
        return content.save();
    }).then(function(newContent){
        responseData.message = '操作成功';
        responseData.data = newContent.comments;
        res.json(responseData);
    });

})

//获取全部评论
router.get('/comment', function(req, res, next) {
    var contentId = req.query.contentid;

    Content.findOne({_id: contentId}).then(function(content){
        //console.info(content);
        responseData.comments = content.comments;
        res.json(responseData);
    })
})

module.exports = router;