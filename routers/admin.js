
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/category');

router.get('/',function(req, res, next){
    if(req.userInfo.username != 'admin'){
        res.send('只有管理员才可以进入管理界面！');
    }
    res.render('admin/index', {
        userInfo: req.userInfo
    });
})

router.get('/user', function(req, res, next){

    var page = req.query.page;
    var limit = 4;


    User.count().then(function(count){
        var pages = Math.ceil(count / limit);
        page = Math.max(1,page);
        page = Math.min(pages, page ? page : 1);
        var skip = limit * (page-1);

        User.find().limit(limit).skip(skip).then(function(userList){
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                userList: userList,
                page: page,
                pages:pages,
                limit:limit,
                count:count
            })
        })
    })

})

router.get('/category', function(req, res, next){

    var page = req.query.page ? req.query.page : 1;
    var limit = 2;

    Category.count().then(function(count){
        var pages = Math.ceil(count / limit);
        page = Math.min(page, 1);
        page = Math.max(page, pages);
        var skip = limit * (page-1);

        Category.find().limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                limit: limit,
                pages: pages,
                count: count
            })
        })
    })


})

router.get('/category/add', function(req, res, next){
    res.render('admin/category_add', {
        userInfo:req.userInfo,
    });
})

router.post('/category/add', function(req, res, next){

    var name = req.body.name;

    if(name == ""){
        res.render('admin/error', {
            userInfo: userInfo,
            message: '请输入分类名称！'
        })
    }

    Category.findOne({name:name}).then(function(rs){
        if(rs){
            res.render('admin/error', {
                userInfo: userInfo,
                message: '已存在该分类！'
            })
        }
    })
})

module.exports = router;