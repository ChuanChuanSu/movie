let express = require('express')
let path = require('path')
let mongoose = require('mongoose')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let logger = require('morgan')
let multipart = require('connect-multiparty');
let fs = require('fs')


let port = process.env.PORT || 3000
let app = express()

app.locals.moment = require('moment');
let dbUrl = 'mongodb://localhost/movie'


mongoose.Promise = global.Promise
mongoose.connect(dbUrl,{useMongoClient:true})

//models loading

let models_path = __dirname + '/app/models'
let walk = function(path){
    fs
        .readdirSync(path)
        .forEach(function(file){
            let newPath = path + '/' + file
            let stat = fs.statSync(newPath)

            if(stat.isFile())
            {
                if(/(.*)\.(js|coffee)/.test(file))
                {
                    require(newPath)
                }
            }
            else if(stat.isDirectory())
            {
                walk(newPath)
            }
        })
}

walk(models_path)

app.set('views','./app/views/pages')
app.set('view engine','jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())//处理cookie的中间件，将cookie中的sessionId解析给session
app.use(session({
    secret : 'Movie',//加密，防止篡改cookie
    store : new MongoStore({
        url : dbUrl,
        collection : 'sessions'
    })
}))
app.use(express.static(path.join(__dirname,'public')))
app.listen(port)



console.log('Movie started on port: ' + port)


if(app.get('env') === 'development')//判断是否是开发环境
{
    app.set('showStackError',true)//显示错误信息
    app.use(logger(':method :url :status'))//打印日志
    app.locals.pretty = true//网页源码格式美化
    mongoose.set('debug',true)
}



//路由

require('./config/routes.js')(app)