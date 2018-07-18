var Movie = require('../models/movie');
var Catetory = require('../models/category');

//index page
exports.index = (req,res) => {
    Catetory.find({}).populate({path:'movies', options:{limit: 5}}).exec((err,categories)=>{
        if(err) console.log(err);
        res.render('index',{
            title:'imooc 首页',
            categories:categories
        })
        
    })
}


//search page
exports.search = (req,res) => {
    let catId = req.query.cat;
    let page = parseInt(req.query.p,10) || 0;
    let count = 2;
    let index = page * count;
    let q = req.query.q;

    if(catId) {
        Catetory.find({_id:catId})
            .populate({
                path:'movies', 
                select:'title poster'
            })
            .exec((err,categories)=>{
            if(err) console.log(err);
            let category = categories[0] || {};
            let movies = category.movies || [];
            var results = movies.slice(index, index+count);
    
            res.render('results',{
                title:'imooc 结果列表页面',
                keyword:category.name,
                currentPage:(page + 1),
                query:'cat=' + catId,
                totalPage: Math.ceil(movies.length / count),
                movies:results
            })
            
        })
    }
    else {
        Movie.find({title: new RegExp(q + '.*', 'i')}).exec((err,movies)=>{
            if(err) console.log(err);
            var results = movies.slice(index, index+count);

            res.render('results',{
                title:'imooc 结果列表页面',
                keyword:q,
                currentPage:(page + 1),
                query:'q=' + q,
                totalPage: Math.ceil(movies.length / count),
                movies:results
            })
            
        })
    }
    
}