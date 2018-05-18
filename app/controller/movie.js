let Movie = require('../models/movie.js')
let Comment = require('../models/comment.js')
let Category = require('../models/category.js')
let path = require('path')
let fs = require('fs')
let underscore = require('underscore')

//detail page
exports.detail = function(req,res){
    let id = req.params.id

    Movie.update({_id : id},{$inc : {pv : 1}},function(err){
        if(err)
            console.log(err)
    })
    Comment
        .find({movie : id})
        .populate('from','name')
        .populate('reply.from reply.to','name')
        .exec(function(err,comments){
            if(err) return console.log(err)
            Movie.findById(id,function(err,movie)
            {
                console.log('访问量')
                console.log(movie.pv)

                if(err)
                {
                    console.log(err)
                }
                else
                {
                    res.render('detail',{
                        title: movie.title,
                        movie: movie,
                        comments : comments
                    })
                }
            })
    })
}

//admin page
exports.movieManage = function(req,res){
    Category.fetch(function(err,categories){
        if(err)
            console.log(err)
        else
        {
            res.render('admin',{
                title: 'Movie 后台录入页',
                movie: {},
                categories : categories
            })
        }
    })
}

//admin post movie

exports.movieAdd = function(req,res){
    let id = req.body.movie._id
    let movieObj = req.body.movie
    let categoryName = movieObj.categoryName
    let _movie

    // console.log('req.poster3')
    // console.log(req.poster)

    if(req.poster)
    {
        // console.log('海报修改成功')
        movieObj.poster = req.poster
    }

    if(id && id !== 'undefined')
    {
        Movie.findById(id,function(err,movie){
            if(err)
            {
                console.log(err)
            }
            else
            {
                _movie = underscore.extend(movie,movieObj)
                _movie.save(function(err,movie){
                    if(err)
                    {
                        console.log(err)
                    }

                    else
                    {
                        if(movie.category !== movie.pastCategory)
                        {
                            Category.findById(movie.category,function(err,category){
                                if(err)
                                    console.log(err)
                                else
                                {

                                    category.movies.push(movie._id)
                                    category.save(function(err,category){
                                        if(err)
                                            console.log(err)
                                        else
                                        {
                                            Category.findById(movie.pastCategory,function(err,category){
                                                if(err)
                                                    console.log(err)
                                                else
                                                {
                                                    let movies = category.movies
                                                    for(let i = 0;i < movies.length;i ++)
                                                    {
                                                        if(movies[i].toString() === movie._id.toString())
                                                        {
                                                            category.movies.splice(i,1)
                                                            category.save(function(err,category){
                                                                if(err)
                                                                    console.log(err)
                                                                else
                                                                {
                                                                    res.redirect('/movie/' + movie._id)
                                                                }
                                                            })
                                                            break
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }

                    }
                })
            }
        })
    }
    else
    {
        _movie = new Movie(movieObj)
        _movie.save(function(err,movie){
            if(err)
            {
                console.log(err)
            }

            else
            {
                if(_movie.category)
                {
                    Category.findById(movie.category,function(err,category){
                        if(err)
                            console.log(err)
                        else
                        {

                            category.movies.push(movie._id)
                            category.save(function(err,category){
                                if(err)
                                    console.log(err)
                                else
                                    res.redirect('/movie/' + movie._id)
                            })
                        }
                    })
                }
                else if(categoryName)
                {
                    let _category = new Category({
                        name : categoryName,
                        movies : [movie._id]
                    })
                    _category.save(function(err,category){
                        if(err)
                            console.log(err)
                        else
                        {
                            movie.category = category._id
                            movie.save(function(err,movie){
                                if(err)
                                    console.log(err)
                                else
                                {
                                    res.redirect('/movie/' + movie._id)
                                }
                            })
                        }
                    })
                }
            }
        })
    }
}


//midWare upload poster
exports.poster = function(req,res,next){
    // console.log('海报识别成功')
    let posterData = req.files.poster
    let filePath = posterData.path
    let originalFilename = posterData.originalFilename

    // console.log('req')
    // console.log(req)
    // console.log('posterData')
    // console.log(posterData)

    // console.log('req.poster1')
    // console.log(req.poster)

    if(originalFilename)
    {
        fs.readFile(filePath,function(err,data){
            let timeStamp = Date.now()
            let type = posterData.type.split('/')[1]
            let poster = timeStamp + '.' + type
            let newPath = path.join(__dirname,'../../','/public/upload/' + poster)
            fs.writeFile(newPath,data,function(err){
                // req.body.movie.poster = poster
                req.poster = poster
                // console.log('req.poster2')
                // console.log('海报更新完成')
                next()
            })
        })
    }
    else
    {
        next()
    }
}


//admin update movie
exports.movieUpdate = function(req,res){
    let id = req.params.id
    Category.find(function(err,categories){
        Movie.findById(id,function(err,movie){
            if(err)
            {
                console.log(err)
            }

            else
            {
                res.render('admin',{
                    title : 'Movie 后台更新页',
                    movie : movie,
                    categories : categories
                })
            }
        })
    })

}

//list page
exports.movieList = function(req,res){
    Movie
        .find()
        .populate('category','name')
        .exec(function(err,movies){
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.render('list',{
                    title: 'Movie 列表页',
                    movies: movies
                })
            }

        })
}

//list delete movie
exports.movieDelete = function(req,res){
    let id = req.query.id
    Movie.findById(id,function(err,movie){
        if(err) console.log('err')
        else
        {
            let catId = movie.category
            Category.findOne({_id : catId},function(err,category){
                if(err)
                    return console.log(err)
                let movies = category.movies
                for(let i = 0;i < movies.length;i ++)
                {
                    if(movies[i].toString() === movie._id.toString())
                    {
                        category.movies.splice(i,1)
                        category.save(function(err){
                            if(err) return console.log(err)
                            Movie.remove({_id : id},function(err){
                                if(err)
                                {
                                    console.log(err)
                                }
                                else
                                {
                                    res.json({success:1})
                                }
                            })
                        })
                        break
                    }
                }

            })
        }
    })




}