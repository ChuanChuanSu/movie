let Comment = require('../models/comment.js')

exports.save = function(req,res){
    let _user = req.session.user
    let _comment = req.body.comment
    let movieId = _comment.movie

    if(!_user)
    {
        return res.redirect('/signIn')
    }

    if(_comment.cid)
    {
        Comment.findById(_comment.cid,function(err,comment){
            if(err)
                console.log(err)
            else
            {
                let reply = {
                    from : _comment.from,
                    to : _comment.tid,
                    content : _comment.content
                }
                comment.reply.push(reply)
                comment.save(function(err,doc){
                    if(err)
                        console.log(err)
                    res.redirect('/movie/' + movieId)
                    console.log('reply:')
                    console.log(reply)
                })
            }
        })
    }

    else
    {
        let comment = new Comment(_comment)
        comment.save(function(err,doc){
            if(err)
                console.log(err)
            else
            {
                res.redirect('/movie/' + movieId)
            }
        })
    }


}