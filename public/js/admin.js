$(document).ready(function(){
    $('.del').click(function(e){
        let target = $(e.target)
        let id = target[0].dataset.id
        let tr = $('.item-id-' + id)

        $.ajax({
            url : '/admin/movie/list?id=' + id,
            type : 'DELETE'
        })
            .done(function(results){
                if(results.success === 1)
                {
                    if(tr.length > 0)
                    {
                        tr.remove()
                    }
                }
            })
    })

    $('#douban').blur(function(){
        let douban = $('#douban')
        let id = douban.val()

        if(id)
        {
            $.ajax({
                url : 'https://api.douban.com/v2/movie/subject/' + id,
                cache : true,
                type : 'get',
                dataType : 'jsonp',
                crossDomain : true,
                jsonp : 'callback',
                success : function(data){
                    $('#inputTitle').val(data.title)
                    $('#inputPoster').val(data.images.large)
                    $('#inputCountry').val(data.countries[0])
                    $('#inputActors').val(data.casts[0].name)
                    $('#inputScore').val(data.rating.average)
                    $('#inputSummary').val(data.summary)
                }
            })
        }
    })
})