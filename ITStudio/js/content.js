//var urlPre = 'http://127.0.0.1:8000';
var urlPre = 'http://52.82.124.217:9998';

var articleId = decodeURI(location.href.substr(location.href.indexOf("?")+4));
console.log(articleId);
var cookieid = getCookie("cookieid");
/*
 * 内容页初始化数据
 */
/*
 * 文章初始化
 */
$.ajax({
    type: "GET",
    //url:"json/articleContent.json",
    url: urlPre+"/api/articleContent",
    data: {
        "cookieid":cookieid,
        "articleId": articleId,
    },
    dataType: "json",
    success: function(data){
        console.log(data);
        if(data.msg=="success"){
            var article = data.article;
            var wrap = $(".content-article").attr("id","article"+article.articleId);
            var title = $("<h1>").text(article.articleTitle).appendTo(wrap);
            var icon = $("<img>").attr("src",article.articleAuthorImg).addClass("author-icon").appendTo(wrap);
            var author = $("<h5>").text(article.articleAuthor).appendTo(wrap);
            var time = $("<span>").text(article.articleTime).appendTo(wrap);
            var note = $("<p>").text(article.articleNote).appendTo(wrap);
            var cover = $("<img>").attr("src",article.articleCover).css("width","100%","height","auto").appendTo(wrap);
            var textWrap = $("<div>").addClass("content-text").html(article.articleText).appendTo(wrap);
        }
    }
})
/*
 * 评论初始化
 */
$.ajax({
    type: "GET",
    //url:"json/articleContent.json",
    url: urlPre+"/api/comment",
    data: {
        "articleId": articleId,
    },
    dataType: "json",
    success: function(data){
        console.log(data);
        if(data.msg=="success"){
            var comment = data.comment;
            var list = $(".comment-list");
            for(var i=0;i<comment.length;i++){
                var commentItem = $("<div>").attr("id","comment"+comment[i].commentId).addClass("comment-item").appendTo(list);
                var img = $("<img>").attr("src",comment[i].commentAuthorImg).appendTo(commentItem);
                var author = $("<h1>").text(comment[i].commentAuthor).appendTo(commentItem);
                var time = $("<span>").text(getDateDiff(comment[i].commentTime)).appendTo(commentItem);
                var button = $("<div>").appendTo(commentItem);
                var up = $("<button>").addClass("thumb-up").text(comment[i].thumbUp).appendTo(button);
                var down = $("<button>").addClass("thumb-down").text(comment[i].thumbDown).appendTo(button);
                var text = $("<p>").text(comment[i].commentText).appendTo(commentItem);
            }
        }
    }
})

/*
 * 发表评论，并刷新评论列表
 */
$("#commentBtn").click(function(){
    var cookieid = getCookie("cookieid");
    var comment = $("#commentInput").val();
    var data={
        "cookieid":cookieid,
        "articleId":articleId,
        "commentText":comment
    };
    dataString = JSON.stringify(data);
    /*
     * 判断登录状态
     */
    $.ajax({
        type: "GET",
        //url:"json/user.json",
        url: urlPre+"/api/user/online",
        data:{
            "cookieid":cookieid
        },
        dataType: "json",
        async:false,
        success: function(data){
            if(data.status=='0'){
                document.cookie="cookieid=";
                alert("请先登录！");
                $(".login-wrap").css("display","block");
            }else {
                if(comment==""){
                    alert("评论不能为空！");
                }else {
                    $.ajax({
                        type: "POST",
                        url: urlPre+"/api/comment",
                        //url: "json/comment.json",
                        data:dataString ,
                        dataType: "json",
                        success: function(data){
                            console.log(data);
                            if(data.msg=="success"){
                                $("#commentInput").val("");
                                var comment = data.comment;
                                var list = $(".comment-list");
                                list.empty();
                                for(var i=0;i<comment.length;i++){
                                    var commentItem = $("<div>").attr("id","comment"+comment[i].commentId).addClass("comment-item").appendTo(list);
                                    var img = $("<img>").attr("src",comment[i].commentAuthorImg).appendTo(commentItem);
                                    var author = $("<h1>").text(comment[i].commentAuthor).appendTo(commentItem);
                                    var time = $("<span>").text(getDateDiff(comment[i].commentTime)).appendTo(commentItem);
                                    var button = $("<div>").appendTo(commentItem);
                                    var up = $("<button>").addClass("thumb-up").text(comment[i].thumbUp).appendTo(button);
                                    var down = $("<button>").addClass("thumb-down").text(comment[i].thumbDown).appendTo(button);
                                    var text = $("<p>").text(comment[i].commentText).appendTo(commentItem);
                                }
                            }
                        }
                    })
                }
            }
        }
    })
})


/*
 * 侧边栏
 * 到底之后固定在footer上方
 */
$(window).scroll(function(){
    var topH = $(".sidebar").position().top;
    var navH = $(".sidebar").offset().top;
    var footerH = $(".footer").offset().top;
    var barH = parseInt($(".sidebar").css("height"));
    var scroH = $(window).scrollTop();
    if(footerH <= navH + barH + 20){
        $(".sidebar").css({"top": (footerH - scroH - barH) - 20});
    }else if(footerH > navH + barH + 120) {
        $(".sidebar").css({"top":400});
    }
});
/*
 * 稍后再看
 */
/*
 * 判断登录状态
 */
laterWatch(".not-later-watch");
laterWatch(".later-watch");
function laterWatch(selector){
    var action = selector==".not-later-watch"?"add":"delete";
    var id;
    $(".sidebar").on("click",selector,function(e){
        var cookieid = getCookie("cookieid");
        var btn = $(this);
        id = $(".content-article").attr("id").substr(7)-'';
        $.ajax({
            type: "GET",
            //url:"json/user.json",
            url: urlPre+"/api/user/online",
            data:{
                "cookieid":cookieid
            },
            dataType: "json",
            async: false,
            success: function (data) {
                console.log(data);
                 if(data.status=='0') {
                     document.cookie="cookieid=";
                    alert("请先登录！");
                    $(".login-wrap").css("display", "block");
                } else {
                    $.ajax({
                        type: "GET",
                        //url:"json/laterWatch.json",
                        url: urlPre+"/api/laterWatch",
                        data: {
                            "cookieid":cookieid,
                            "action": action,
                            "articleId": id
                        },
                        dataType: "json",
                        success: function(data){
                            console.log(data);
                            if(data.msg=="success"){
                                /*
                                 * 数据提交成功，开始设置点击效果
                                 */
                                switch(action){
                                    /*
                                     * 添加至稍后再看
                                     */
                                    case "add":
                                        btn.removeClass("not-later-watch").addClass("later-watch");
                                        /*
                                         * 抛物线效果
                                         */
                                        var targetLeft = $("#logBtn").position().left;
                                        var targetTop = $("#logBtn").position().top;
                                        var flyer = $("<button>").attr("id","fly");
                                        flyer.fly({
                                            start:{
                                                left: e.clientX,  //开始位置（必填）#fly元素会被设置成position: fixed
                                                top: e.clientY,  //开始位置（必填）
                                            },
                                            end:{
                                                left: targetLeft+20, //结束位置（必填）
                                                top: targetTop+20,  //结束位置（必填）
                                                width: 5, //结束时宽度
                                                height: 5, //结束时高度
                                            },
                                            autoPlay: true, //是否直接运动,默认true
                                            speed: 1.0, //越大越快，默认1.2
                                            vertex_Rtop: 0, //运动轨迹最高点top值，默认20
                                            onEnd: function(){
                                                this.destroy(); //移除dom
                                            } //结束回调
                                        });
                                        break;
                                    /*
                                     * 从稍后再看中删除
                                     */
                                    case "delete":
                                        btn.removeClass("later-watch").addClass("not-later-watch");
                                        break;
                                }
                            }
                        }
                    })
                }
            }
        })

    })
}
/*
 * 文章点赞
 */
articleThumb(".not-thumb-up");
articleThumb(".al-thumb-up");
function articleThumb(ele){
    var action = ele[1]=='n'?"add":"delete";
    var id;
    $(".sidebar").on("click",ele,function(e){
        var btn = $(this);
        var id = $(".content-article").attr("id").substr(7);
        switch(action){
                            case "add":
                                btn.removeClass("not-thumb-up").addClass("al-thumb-up");
                                break;
                            case "delete":
                                btn.removeClass("al-thumb-up").addClass("not-thumb-up");
                                break;
                        }
        // $.ajax({
        //     type:"GET",
        //     url:"json/articleThumb.json",
        //     data:{
        //         id:id,
        //         "action":action
        //     },
        //     dataType: "json",
        //     success:function(data){
        //         if(data=="success"){
        //             /*
        //              * 数据提交成功，开始设置效果
        //              */
        //             switch(action){
        //                 case "add":
        //                     btn.removeClass("not-thumb-up").addClass("al-thumb-up");
        //                     break;
        //                 case "delete":
        //                     btn.removeClass("al-thumb-up").addClass("not-thumb-up");
        //                     break;
        //             }
        //         }
        //     }
        // })
    })
}
/*
 * 侧边栏评论按钮
 */
$("#goto-comment").click(function(){
    var position = $("#commentInput").val();
    $('#commentInput').val("").focus().val(position);
})

/*
 * 评论点赞
 */
commentThumb(".thumb-up");
commentThumb(".thumb-down");
commentThumb(".thumbed-up");
commentThumb(".thumbed-down");
function commentThumb(selector){
    var action = selector.substr(1,7)=="thumbed"?"delete":"add";
    var direction = selector.substr(selector.length-1)=="p"?"up":"down";
    var id;
    $(".comment-list").on("click",selector,function(){
        var btn = $(this);
        id = $(this).parent().parent(".comment-item").attr("id").substr(7);
        $.ajax({
            type:"GET",
            //url:"json/commentThumb.json",
            url:urlPre+"/api/commentThumb",
            data:{
                "commentId":id,
                "direction":direction,
                "action":action
            },
            dataType: "json",
            success:function(data) {
                console.log(data);
                if(data.msg=="success"){
                    switch(selector){
                        case ".thumb-up":
                            btn.removeClass("thumb-up").addClass("thumbed-up").text(data.thumbUp);
                            break;
                        case ".thumbed-up":
                            btn.removeClass("thumbed-up").addClass("thumb-up").text(data.thumbUp);
                            break;
                        case ".thumb-down":
                            btn.removeClass("thumb-down").addClass("thumbed-down").text(data.thumbDown);
                            break;
                        case ".thumbed-down":
                            btn.removeClass("thumbed-down").addClass("thumb-down").text(data.thumbDown);
                            break;
                    }
                }
            }
        })
    })

}