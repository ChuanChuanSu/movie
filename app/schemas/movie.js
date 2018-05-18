let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let MovieSchema = new Schema({
    title : String,
    poster : String,
    video : String,
    country : String,
    language : String,
    pv : {
        type : Number,
        default : 0
    },
    category : {
        type : ObjectId,
        ref : 'Category'
    },
    actors : String,
    score : String,
    summary : String,
    src : String,
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
MovieSchema.pre('save',function(next){
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


MovieSchema.statics = {
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
    //     console.log('2' + id)
    //     if (id.match(/^[0-9a-fA-F]{24}$/))
    //     {
    //         console.log('1')
    //         let a = this
    //             .findOne({_id:ObjectId(id)})
    //             .exec(cb)
    //         if(!a)console.log('查询失败')
    //         else console.log(a)
    //         return a
    //     }
    //     else
    //     {
    //         console.log('2')
    //         return {}
    //     }
    //
    // }
}

module.exports = MovieSchema