
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

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
    var breads = [
        {
            title:'用户列表'
        }
    ]

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
                count:count,
                pageName: 'user',
                breads: breads
            })
        })
    })

})

router.get('/category', function(req, res, next){

    var page = req.query.page ? req.query.page : 1;
    var limit = 2;
    var breads = [
        {
            title:'分类列表'
        }
    ]

    Category.count().then(function(count){
        var pages = Math.ceil(count / limit);
        page = Math.max(page, 1);
        page = Math.min(page, pages);
        var skip = limit * (page-1);

        /*
        * sort 1:升序 -1 降序  生成数据时候，id的生成带有时间戳
        * */
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                pageName: 'category',
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                limit: limit,
                pages: pages,
                count: count,
                breads: breads
            })
        })
    })


})

router.get('/category/add', function(req, res, next){
    var breads = [
        {
            title:'分类列表',
            url: '/category'
        },
        {
            title: '新增分类'
        }
    ]
    res.render('admin/category_add', {
        userInfo:req.userInfo,
        breads: breads
    });
})

router.post('/category/add', function(req, res, next){

    var breads = [
        {
            title:'分类列表',
            url: '/admin/category'
        },
        {
            title: '新增分类'
        }
    ]
    var name = req.body.name;

    if(name == ""){
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '请输入分类名称！',
            breads: breads
        })
    }

    Category.findOne({name:name}).then(function(rs){
        if(rs){
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '已存在该分类！',
                breads: breads
            })
            return Promise.reject();
        }else{
            var cate = new Category({
                name: name
            })
            return cate.save();
        }
    }).then(function(cate){
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category',
            breads: breads
        });
    })
})

router.get('/category/edit', function(req, res, next){

    var id = req.query.id;
    var breads = [
        {
            title:'分类列表',
            url: '/admin/category'
        },
        {
            title: '编辑分类'
        }
    ];
    var data = {
        userInfo: req.userInfo,
        breads: breads
    };
    if(id == ""){
        data.message = '没有该分类';
        res.render('admin/error', data)
        return;
    }

    Category.findOne({_id:id}).then(function(category) {
        if (!category) {
            data.message = '没有该分类';
            res.render('admin/error', data);
            return;
        }
        data.category = category;
        res.render('admin/category_edit', data);
    })
})

router.post('/category/edit', function(req, res, next){

    var id = req.body.id;
    var name = req.body.name;
    var breads = [
        {
            title:'分类列表',
            url: '/admin/category'
        },
        {
            title: '编辑分类'
        }
    ];
    var data = {
        userInfo: req.userInfo,
        breads: breads,
    }

    Category.findOne({_id: id}).then(function(rs){
        if(name == rs.name){
            data.message = '分类修改成功';
            res.render('admin/success', data);
            return Promise.reject();
        }
        return Category.findOne({
            id:{$ne:id},
            name:name
        })
    }).then(function(sameCate){
        if(sameCate){
            data.message = '该分类名称已存在！';
            res.render('admin/error', data);
            return;
        }
        Category.update({_id:id},{name:name}).then(function(rs){
            res.render('admin/success', {
                message: '修改成功',
                url: '/admin/category/edit?id='+id
            })
        })
    })



})

router.get('/category/delete', function(req, res, next){

    var id = req.query.id;
    var breads = [
        {
            title:'分类列表'
        }
    ];
    Category.remove({_id: id}).then(function(){
        res.render('admin/error', {
            userInfo: req.userInfo,
            breads: breads,
            message: '删除成功'
        })
    })

})

router.get('/content', function(req, res, next){

    var page = req.query.page ? req.query.page : 1;
    var limit = 6;
    var breads = [
        {
            title: '内容管理'
        }
    ]

    Content.count().then(function(count){
        var pages = Math.ceil(count / limit);
        page = Math.max(page, 1);
        page = Math.min(page, pages);
        var skip = limit * (page-1);

        Content.find().limit(limit).skip(skip).populate('category').sort({addTime:-1}).then(function(contentes){
            res.render('admin/content_index',{
                pageName: 'content',
                userInfo: req.userInfo,
                contents: contentes,
                page: page,
                limit: limit,
                pages: pages,
                count: count,
                breads: breads
            })
        })
    })
})

router.get('/content/add', function(req, res, next){
    var breads = [
        {
            url: '/admin/content',
            title: '内容管理'
        },
        {
            title: '新增内容'
        }
    ]

    Category.find().sort({_id: -1}).then(function(cate){
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: cate,
            breads: breads
        })
    })
})

router.post('/content/add', function(req, res, next){
    var breads = [
        {
            title: '内容管理',
            url: '/admin/content'
        },
        {
            title: '新增内容',
        }
    ];
    var data = {
        breads: breads,
        userInfo: req.userInfo,
        message: ''
    }
    if(req.body.category == ''){
        data.message = '分类不能为空'
        res.render('admin/error',data);
        return;
    }
    if(req.body.title == ''){
        data.message = '标题不能为空'
        res.render('admin/error',data);
        return;
    }
    if(req.body.description == ''){
        data.message = '描述不能为空'
        res.render('admin/error',data);
        return;
    }
    if(req.body.content == ''){
        data.message = '内容不能为空'
        res.render('admin/error',data);
        return;
    }

    var category = req.body.category;
    var title = req.body.title;
    var description = req.body.description;
    var content = req.body.content;

    var newContent = new Content({
        category: category,
        title: title,
        description: description,
        content: content
    })
    newContent.save().then(function(rs){
        data.message = '内容添加成功'
        res.render('admin/success',data);
    })

})

router.get('/content/edit', function(req, res, next){

    var id = req.query.id || '';
    var breads = [
        {
            url: '/admin/content',
            title: '内容管理'
        },
        {
            title: '内容编辑'
        }
    ]

    var categories = [];

    Category.find().sort({_id: 1}).then(function(rs) {

        categories = rs;

        return Content.findOne({
            _id: id
        }).populate('category');
    }).then(function(content) {

        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '指定内容不存在',
                breads: breads
            });
            return Promise.reject();
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                categories: categories,
                content: content,
                breads: breads
            })
        }
    });



})

router.post('/content/edit', function(req, res, next){

    var category = req.body.category;
    var title = req.body.title;
    var description = req.body.description;
    var content = req.body.content;
    var id = req.body.id;


    Content.update({
        _id:id
    },{
        category: category,
        title: title,
        description: description,
        content: content
    }).then(function(rs){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: "修改成功",
            url: '/admin/content/edit?id='+id
        })
    })

})

router.get('/content/delete', function(req, res, next){

    var id = req.query.id;
    var breads = [
        {
            title:'内容列表'
        }
    ];
    Content.remove({_id: id}).then(function(rs){
        res.render('admin/success', {
            userInfo: req.userInfo,
            breads: breads,
            message: '删除成功aaa'
        })
    })

})

module.exports = router;