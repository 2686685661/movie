var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

//detail page
exports.detail = (req,res) => {
    var id = req.params.id;
    Movie.findById(id,function(err,movie) {
        Movie.update({_id: id},{$inc:{pv:1}},(err) => {
            if(err) console.log(err);
        })
        Comment
        .find({movie:id})
        .populate('from','name')
        .populate('reply.from reply.to','name')
        .exec((err,comments)=>{
            console.log(comments);
            if(err) console.log(err);
            else 
                res.render('detail',{
                    title:'imooc ' + movie.title,
                    movie:movie,
                    comments:comments
                });
        })
    })
}

//admin new page
exports.new = (req,res) => {

    Category.find({},(err,categories) => {
        res.render('admin',{
            title:'imooc 后台录入页',
            categories:categories,
            movie:{}
        })
    })
}

//admin update movie
exports.update = (req,res)=>{
    var id = req.params.id;
    if(id) {
        Movie.findById(id,(err,movie)=>{
            Category.find({},(err,categories) => {
                res.render('admin',{
                    title:'imooc 后台更新页',
                    movie:movie,
                    categories:categories
                })
            })
        })
    }
}

//admin poster
exports.savePoster = (req,res,next) => {
    let posterDate = req.files.uploadPoster;
    let filePath = posterDate.path;
    let originalFilename = posterDate.originalFilename;

    console.log(req.files);

    if(originalFilename) {
        fs.readFile(filePath,(err,data) => {
            let timestamp = Date.now();
            let type = posterDate.type.split('/')[1];
            let poster = timestamp + '.' + type;
            let newPath = path.join(__dirname,'../../','/public/upload/' + poster);
            fs.writeFile(newPath, data, (err) => {
                req.poster = poster;
                next();
            })
        })
    }
    else next();
}

//admin post movie
exports.save = (req,res)=>{
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie =null;

    if(req.poster) {
        movieObj.poster = req.poster;
    }
    if(id) {
        Movie.findById(id,(err,movie)=>{
            if(err) console.log(err);
            _movie = _.extend(movie,movieObj);
            _movie.save((err,movie)=>{
                if(err) console.log(err);
                res.redirect('/movie/'+movie._id);
            });
        })
    }else {
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;
        _movie.save((err,movie)=>{
            if(err) console.log(err);
           if(categoryId) {
                Category.findById(categoryId, (err,category) => {
                    category.movies.push(movie._id);
                    category.save((err,category) => {
                        res.redirect('/movie/'+movie._id);
                    })
                })
           }
           else if(categoryName) {
                var category = new Category({
                    name:categoryName,
                    movies:[movie._id]
                })
                category.save((err,category) => {
                    movie.category = category._id;
                    movie.save((err,movie) => {
                        res.redirect('/movie/'+movie._id);
                    })
                })
           }

        });
    }
}

//list page
exports.list = (req,res) => {
    Movie.find({}).populate('category', 'name').exec((err,movies) => {
        if(err) console.log(err);
        res.render('list',{
            title: 'imooc 列表页',
            movies:movies
        })
    });
}

//list delete movie
exports.del = (req,res)=>{
    let id = req.query.id;
    if(id) {
        Movie.remove({_id:id},(err,movie)=>{
            if(err) {
                console.log(err);
                res.json({success:0});
            }
            else res.json({success:1});
        })
    }
}