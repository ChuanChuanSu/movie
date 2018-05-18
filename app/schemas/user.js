let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')//盐模块 用于密码加密
let SALT_WORK_FACTOR = 10

let UserSchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true
    },
    password : String,
    //0 : normal user
    //1 : verified user
    //...
    //>=10 : admin
    //...
    //>=50 : super admin
    role : {
        type : Number,
        default : 0
    },
    meta : {
        createAt : {
            type : Date,
            default : Date.now()
        },
        updateAt : {
            type : Date,
            default : Date.now()
        }
    }
})

//pre钩子
UserSchema.pre('save',function(next){
    let user = this
    if(this.isNew)
    {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else
    {
        this.meta.updateAt = Date.now()
    }

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){ // 产生盐
        if(err) return next(err)
        bcrypt.hash(user.password,salt,function(err,hash){  //将盐与原始密码共同加密，输出最终的存储密码hash
            if(err) return next(err)
            user.password = hash
            // console.log('2')
            // console.log(user)
            next()
        })
    })

    // next()
})

UserSchema.methods = {
    comparePassword : function(_password ,cb){
        // console.log(this.password)
        bcrypt.compare(_password,this.password,function(err,isMatch){
            if(err)
                cb(err)
            else
            {
                // console.log(_password)
                // console.log(isMatch)
                cb(null,isMatch)

            }
        })
    }
}

UserSchema.statics = {
    fetch : function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById : function(id,cb){

        return this
            .findOne({_id:id})
            .exec(cb)
    }

}

module.exports = UserSchema