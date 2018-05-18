let Index = require('../app/controller/index')
let User = require('../app/controller/user')
let Movie = require('../app/controller/movie')
let Comment = require('../app/controller/comment')
let Category = require('../app/controller/category')

let multipart = require('connect-multiparty');
let multipartMiddleware = multipart();



module.exports = function(app){
    //pre page

    app.use(function(req,res,next){
        // let _user = req.session.user
        // app.locals.user = _user  //设置app.locals中的user，方便jade模板渲染
        app.locals.user = req.session.user
        next()
    })
//index page
    app.get('/',Index.index)
//user
    app.post('/user/signUp',User.signUp)
    app.post('/user/signIn',User.signIn)
    app.get('/signUp',User.showSignUp)
    app.get('/signIn',User.showSignIn)
    app.get('/logOut',User.logOut)
    app.get('/admin/user/list',User.signInRequired,User.adminRequired,User.userList)
//movie
    app.get('/movie/:id',Movie.detail)//电影详情页
    app.get('/admin/movie/new',User.signInRequired,User.adminRequired,Movie.movieManage)//电影新建页
    app.get('/admin/movie/update/:id',User.signInRequired,User.adminRequired,Movie.movieUpdate)//电影更新页
    app.get('/admin/movie/list',User.signInRequired,User.adminRequired,Movie.movieList)//电影列表页
    app.post('/admin/movie/new',User.signInRequired,User.adminRequired,multipartMiddleware,Movie.poster,Movie.movieAdd)//提交新建电影信息
    app.delete('/admin/movie/list',User.signInRequired,User.adminRequired,Movie.movieDelete)
//comment
    app.post('/user/comment',User.signInRequired,Comment.save)
//category
    app.get('/admin/category/new',User.signInRequired,User.adminRequired,Category.categoryManage)
    app.post('/admin/category/new',User.signInRequired,User.adminRequired,Category.categoryAdd)//新建分类
    app.get('/admin/category/list',User.signInRequired,User.adminRequired,Category.categoryList)//所有分类列表
//result
    app.get('/results',Index.search)
}
