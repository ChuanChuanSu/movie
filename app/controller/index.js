let Category = require('../models/category.js')
let Movie = require('../models/movie.js')

//Index
exports.index = function(req,res){
    Category
        .find({})
        .populate({path : 'movies',options : {limit : 5}})
        .exec(function(err,categories){
            if(err)
            {
                console.log(err)
            }
            else
            {

                res.render('index',{
                    title: 'Movie 首页',
                    categories: categories
                })
            }
        })
}

//search page
exports.search = function(req,res){
    let catId = req.query.cat
    let q = req.query.q
    let page = parseInt(req.query.p,10)

    //每页数据量
    let count = 2
    let index = (page - 1) * count


    //分类展示
    if(catId)
    {
        Category
            .find({_id : catId})
            .populate({
                path : 'movies',
                select : 'title poster',
            })
            .exec(function(err,categories){
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    let category = categories[0]
                    let movies
                    if(page === Math.ceil(categories[0].movies.length/count))
                        movies = categories[0].movies.slice(index)
                    else
                        movies = categories[0].movies.slice(index,index + count)
                    res.render('results',{
                        title: 'Movie 分类结果页面',
                        category : category,
                        movies : movies,
                        query : 'cat=' + catId,
                        totalPage : Math.ceil(categories[0].movies.length/count),
                        currentPage : page
                    })
                }
            })
    }

    //搜索
    else
    {
        Movie
            .find({title : new RegExp(q + '.*','i')})
            .exec(function(err,movies){
                if(err)
                {
                    console.log(err)
                }
                else
                {
                    let movie
                    if(page === Math.ceil(movies.length/count))
                        movie = movies.slice(index)
                    else
                        movie = movies.slice(index,index + count)
                    res.render('results',{
                        title: 'Movie 搜索结果页面',
                        movies : movie,
                        query : q,
                        totalPage : Math.ceil(movies.length/count),
                        currentPage : page
                    })
                }
            })
    }

}