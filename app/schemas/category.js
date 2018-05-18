let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let CategorySchema = new Schema({
    name : String,
    movies : [{type : ObjectId,ref : 'Movie'}],
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
},{ usePushEach: true })

//pre钩子
CategorySchema.pre('save',function(next){
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


CategorySchema.statics = {
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

module.exports = CategorySchema