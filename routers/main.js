
var express = require('express');
var router = express.Router();

var Category = require('../models/category');
var Content = require('../models/content');

router.get('/',function(req, res, next){
    Category.find().sort({_id: -1}).then(function(cate){
        Content.find().sort({_id: -1}).then(function(contents){
            res.render('main/index', {
                userInfo: req.userInfo,
                categories: cate,
                contents: contents
            });
        })
    })

})



module.exports = router;