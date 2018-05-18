let User = require('../models/user.js')


//signUp page
exports.showSignUp = function(req,res){
    res.render('signUp',{
        title: '注册'
    })
}

exports.signUp = function(req,res){
    let user = req.body.user
    //req.param()已被弃用
    //req.body req.query req.params
    User.find({name : user.name},function(err,docs){
        if(err)
            console.log(err)
        else
        {
            if(docs.length > 0)
            {
                console.log('用户名重复！')
                res.redirect('/signIn')
            }
            else
            {
                let newUser = new User({
                    name : user.name,
                    password : user.password
                })
                // console.log('1')
                newUser.save(function(err,doc){
                    if(err)
                        console.log(err)
                    res.redirect('/')
                })
                // console.log('3')
                //1,3,2,userList加载完成
            }

        }
    })
}

//userList page
exports.userList = function(req,res){
    // console.log('userList加载完成')
    User.fetch(function(err,users){
        if(err)
        {
            console.log(err)
        }

        else
        {
            // console.log(movies)
            res.render('userList',{
                title: 'User 列表页',
                users: users
            })
        }
    })
}


//signIn page

exports.showSignIn = function(req,res){
    res.render('signIn',{
        title: '登陆'
    })
}

exports.signIn = function(req,res){
    let _user = req.body.user
    let name = _user.name
    let password = _user.password

    User.findOne({name : name},function(err,user){
        if(err)
            return console.log(err)
        if(!user)
        {
            return res.redirect('/signUp')
        }

        user.comparePassword(password,function(err,isMatch){
            if(err)
                return console.log(err)
            if(isMatch)
            {
                req.session.user = user  //登陆成功后，设置会话session中的user
                // app.locals.user = user
                // console.log('登陆')
                res.redirect('/')
            }
            else
            {
                console.log('登录失败:D')
                res.redirect('/signIn')
            }
        })
    })
}

//logOut page

exports.logOut = function(req,res){
    delete req.session.user //注销账号后，删除session中的user
    // delete app.locals.user  //删除app.locals中的user

    res.redirect('/')
}


//user state check

exports.signInRequired = function(req,res,next) {
    let user = req.session.user
    if (!user)
    {
        console.log('请登陆！')
        return res.redirect('/signIn')
    }
    next()
}

exports.adminRequired = function(req,res,next){
    let user = req.session.user
    if(!user.role || user.role < 10)
    {
        console.log('请切换管理员身份后重新尝试！')
        return res.redirect('/signIn')
    }
    next()
}