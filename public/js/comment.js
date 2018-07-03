
var page = 1;
var contentId = $('#contentId').val();
var comments = [];
var pages = 1;
var limit = 6;

$('#messageBtn').click(function(){
    $.ajax({
        type: 'post',
        url: 'api/comment/post',
        data: {
            contentid: contentId,
            comment: $('#messageContent').val()
        },
        dataType: 'JSON',
        success: function(res){
            if(res.code == 0){
                comments = res.data;
                renderComment();
            }
        }
    })
})

//获取所有评论
$.ajax({
    type:'get',
    url:'api/comment',
    data:{
        contentid:contentId
    },
    success: function(data){
        if(data.code == 0){
            comments = data.comments;
            renderComment();
        }
    }
})

$('.pager').delegate('a', 'click', function() {
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment();
});

function renderComment(){
    pages = Math.ceil(comments.length / limit);
    var start = Math.max((page - 1)*limit,0);
    var end = Math.min((start + limit), comments.length);

    var $lis = $('.pager li');
    $lis.eq(1).html( page + ' / ' +  pages);

    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    if (comments.length == 0) {
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
    } else {
        var html = '';
        for (var i=start; i<end; i++) {
            html += '<div class="messageBox">'+
                '<p class="name clear"><span class="fl">'+comments[i].username+'</span><span class="fr">'+ formatDate(comments[i].postTime) +'</span></p><p>'+comments[i].content+'</p>'+
                '</div>';
        }
        $('.messageList').html(html);
    }
}

function formatDate(d) {
    var date1 = new Date(d);
    return date1.getFullYear() + '年' + (date1.getMonth()+1) + '月' + date1.getDate() + '日 ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}








