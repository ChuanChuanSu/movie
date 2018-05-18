let Category = require('../models/category.js')



exports.categoryManage = function(req,res){
    res.render('category',{
        title: 'Category 后台录入页',
        category : {}
    })
}

exports.categoryAdd = function(req,res){
    let categoryObj = req.body.category
    let categoryName = categoryObj.name
    let _category

    Category.findOne({name : categoryName},function(err,category){
        if(err)
            console.log(err)
        else
        {
            if(category)
            {
                res.redirect('/admin/category/list')
                console.log('分类已存在')
            }
            else
            {
                _category = new Category({
                    name : categoryName,
                    movies : []
                })
                _category.save(function(err,category){
                    if(err)
                        console.log(err)
                    else
                        res.redirect('/admin/category/list')
                })
            }
        }

    })
}

exports.categoryList = function(req,res){
    Category
        .find()
        .populate('movies','title')
        .exec(function(err,categories){
        if(err)
            console.log(err)
        else
        {
            res.render('categoryList',{
                title : '分类列表页',
                categories : categories
            })
        }
    })
}