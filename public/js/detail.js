$(function(){
    $('.comment').click(function(e){
        let target = $(this)
        let toId = target.data('tid')//被回复人ID
        let commentId = target.data('cid')//被回复评论ID


        if($('#toId').length > 0)
        {
            $('#toId').val(toId)
            $('#commentId').val(commentId)
        }
        else
        {
            $('<input>').attr({
                type : 'hidden',
                id : 'toId',
                name : 'comment[tid]',
                value : toId
            }).appendTo('#commentForm')

            $('<input>').attr({
                type : 'hidden',
                id : 'commentId',
                name : 'comment[cid]',
                value : commentId
            }).appendTo('#commentForm')
        }
    })
})