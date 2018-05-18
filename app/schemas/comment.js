let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let CommentSchema = new Schema({
    //评论的哪部电影
    movie : {
        type : ObjectId,
        ref : 'Movie'
    },
    //评论者
    from : {
        type : ObjectId,
        ref : 'User'
    },
    reply : [{
        from : {type : ObjectId,ref : 'User'},
        to : {type : ObjectId,ref : 'User'},
        content : String
    }],
    //被回复者
    to : {
        type : ObjectId,
        ref : 'User'
    },
    content : String,
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
},{ usePushEach: true })//{ usePushEach: true }不加此项，mongoose3.6以后的版本，向reply中push时会出错

//pre钩子
CommentSchema.pre('save',function(next){
    if(this.isNew)
    {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else
    {
        this.meta.updateAt = Date.now()
    }

    next()
})


CommentSchema.statics = {
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

module.exports = CommentSchema