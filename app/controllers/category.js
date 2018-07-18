var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');


//admin new page
exports.new = (req,res) => {
    res.render('category_admin',{
        title:'imooc 后台分类录入页',
        category:{}
    })
}

exports.save = (req,res)=>{
    var _category = req.body.category;
    var category = new Category(_category);
    category.save((err,category)=>{
        if(err) console.log(err);
        res.redirect('/admin/category/list');
    });
    
}

//category list page
exports.list = (req,res) => {
    Category.fetch(function(err,catetories) {
        if(err) console.log(err);
        res.render('catetorylist',{
            title:'imooc 分类列表页',
            catetories:catetories
        })
    });
}



