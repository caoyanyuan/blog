
var express = require('express');
var router = express.Router();

var Category = require('../models/category');
var Content = require('../models/content');
var data;

/*使用中间件来处理通用的数据*/
router.use(function(req, res, next){
    data = {
        userInfo: req.userInfo,
        categories: []
    };

    Category.find().then(function(cate){
        data.categories = cate;
        next();
    })

})

router.get('/',function(req, res, next){

    var category = req.query.category || "";
    data.page = req.query.page || 1;
    var limit = 6;

    var where = {};
    if(category){
        where.category = category;
        data.category = category;
    }

    Content.where(where).count().then(function(count){

        data.pages = Math.ceil(count/limit);
        data.page = Math.max(data.page, 1);
        data.page = Math.min(data.pages, data.page);
        var skip = (data.page - 1) * limit;
        return Content.where(where).limit(limit).skip(skip).sort({addTime: -1});
    }).then(function(contents){

        data.contents = contents;
        res.render('main/index', data);
    })

})

router.get('/view', function(req, res, next){

   var id = req.query.id;

   Content.findOne({_id: id}).then(function(content){

        data.content = content;
        content.views++;
        content.save();

        res.render('main/view', data);
   })

})

module.exports = router;