module.exports = function(grunt){
    grunt.initConfig({
        watch : {
            jade : {
                files : ['views/**'],//监视的文件
                options : {
                    livereload : true//文件变化立即重启
                }
            },
            js : {
                files : ['public/js/**','schemas/**/*.js','models/**/*.js'],
                options : {
                    livereload : true
                }
            }
        },

        jshint : {
            options : {
                jshintrc : '.jshintrc',
                ignores : ['public/libs/**/*.js']
            },
            all : ['public/js/*.js','test/**/*.js','app/**/*.js']
        },

        less : {
            development : {
                options : {
                    compress : true,
                    yuicompress : true,
                    optimization : 2
                },
                files : {
                    'public/build/index.css' : 'public/less/index.less'
                }
            }
        },

        uglify : {
            development : {
                files : {
                    'public/build/admin.min.js' : 'public/js/admin.js',
                    'public/build/detail.min.js' : [
                        'public/js/detail.js'
                    ]
                }
            }

        },




        //watch和nodemon的区别：watch可以在见识到文件变化后进行操作（jshint:js代码验证），nodemon不可以
        nodemon : {
            dev : {
                script : 'app.js',//nodemon运行的文件
                options : {
                    // protocol : "inspector",
                    args: [],//传给script的参数
                    ignore : ['README.md','node_modules/**','.DS_Store'],//忽略的文件
                    ext : 'js',//待监视文件扩展名
                    watch : ['./'],//待监视文件夹名
                    // nodeArgs: ['--debug'],
                    // nodeArgs: ['--debug'],
                    nodeArgs: ['--inspect'],
                    delay : 1,//有大批量文件编译时不会立即重启服务，而是会等待delay毫秒
                    env : {
                        PORT : 3000
                    },
                    cwd : __dirname//script所在路径
                }
            }
        },

        mochaTest : {
            options : {
                reporter : 'spec'
            },
            src : ['test/**/*.js']
        },

        concurrent : {
            tasks : ['nodemon','watch'],//同时执行nodemon和watch任务
            options : {
                logConcurrentOutput : true
            }
        }
    })


    grunt.loadNpmTasks('grunt-contrib-watch')//文件添加、修改、删除时执行任务
    grunt.loadNpmTasks('grunt-contrib-nodemon')//实时监听入口文件app.js
    grunt.loadNpmTasks('grunt-concurrent')//针对慢任务 less sass
    grunt.loadNpmTasks('grunt-mocha-test')//mocha测试
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-contrib-less')//编译css文件
    grunt.loadNpmTasks('grunt-contrib-uglify')//js文件压缩




    grunt.option('force',true)//防止error中断任务

    grunt.registerTask('default',['concurrent'])//任务注册代码
    grunt.registerTask('test',['mochaTest'])

}