//var urlPre = 'http://127.0.0.1:8000';
var urlPre = 'http://52.82.124.217:9998';

var cookieid = getCookie("cookieid");
/*
 * 判断弹框
 */
var urlRequest = decodeURI(document.location.href);
var userStatus = urlRequest.substr(urlRequest.indexOf('?')+1);
if(userStatus=="status=0"){
    $(".login-wrap").css("display","block");
}


var pageNumber=2;
var pageSize=6;
var addSize=3;
/*
 * 首页初始化数据
 */
/*
 * 文章列表,加载更多
 */
getArticle(0,pageSize);
$(".articles").on("click","#addMore",function(){
    getArticle(pageNumber++,addSize);
})
/*
 * 短趣传言列表
 */
getOther("短趣",0,addSize);
getOther("传言",0,addSize);
function getOther(sort,pageNumber,pageSize){
    $.ajax({
        type: "GET",
        //url:"json/index.json",
        url: urlPre+"/api/getList",
        data: {
            "cookieid":cookieid,
            "sort":sort,
            "pageNumber":pageNumber,
            "pageSize":pageSize,
            "year":null,
            "month":null,
            "day":null
        },
        dataType: "json",
        success: function (data) {
            if (data.msg == "success") {
                if(sort=="短趣"){
                    /*
                     * 获取"短趣"数据
                     */
                    var list = $(".short-news").children(".wrap-list");
                    var short = data.article;
                    for(var i=0;i<short.length;i++){
                        var shortItem = $("<div>").attr("id","issay"+short[i].articleId).addClass("short-item").appendTo(list).click(function(){
                            window.open("content.html?id="+$(this).attr("id").substr(5),"_self");
                        });
                        var title = $("<h1>").text(short[i].articleTitle).appendTo(shortItem);
                        var img = $("<img>").attr("src",short[i].articleAuthorImage).appendTo(shortItem);
                        var author = $("<span>").text(short[i].articleAuthor).appendTo(shortItem);
                        var time = $("<span>").text(getDateDiff(short[i].articleTime)).appendTo(shortItem);
                        var reading = $("<p>").text(short[i].articleReading).appendTo(shortItem);
                    }
                } else if(sort=="传言"){
                    /*
                     * 获取"传言"数据
                     */
                    var list = $(".gossip").children(".wrap-list");
                    var gossip = data.article;
                    for(var i=0;i<gossip.length;i++){
                        var gossipItem = $("<div>").attr("id","issay"+gossip[i].articleId).css({"background":"url('"+gossip[i].articleImg+"')","background-size":"100% 100%"}).addClass("gossip-item").appendTo(list).click(function(){
                            window.open("content.html?id="+$(this).attr("id").substr(5),"_self");
                        });
                        var title = $("<h1>").text(gossip[i].articleTitle).appendTo(gossipItem);
                        var statusText;
                        switch(gossip[i].gossipStatus){
                            case "not-refuted":
                                statusText="传言中";break;
                            case "refuted":
                                statusText="已辟谣";break;
                            case "confirmed":
                                statusText="已证实";break;
                        }
                        var status = $("<span>").text(statusText).addClass(gossip[i].gossipStatus).appendTo(gossipItem);
                    }
                }

            }
        }
    })
}
function getArticle(pageNumber,pageSize){
    $.ajax({
        type:"GET",
        //url:"json/addMore.json",
        url:urlPre+"/api/getListAll",
        data:{
            "cookieid":cookieid,
            "pageNumber":pageNumber,
            "pageSize":pageSize
        },
        dataType:"json",
        success:function(data){
            if(data.msg=="success"){
                /*
                 * 获取"文章列表"数据
                 */
                var list = $(".articles");
                var article = data.article;
                for(var i=0;i<article.length;i++){
                    var articleItem = $("<div>").attr("id","issay"+article[i].articleId).addClass("article-item").appendTo(list);
                    var img = $("<img>").attr("src",article[i].articleImg).appendTo(articleItem);
                    var articleInfo = $("<div>").addClass("article-info").appendTo(articleItem);
                    var title = $("<h1>").text(article[i].articleTitle).addClass("hot"+article[i].articleHot).appendTo(articleInfo);
                    var time = $("<span>").text(getDateDiff(article[i].articleTime)).appendTo(articleInfo);
                    var later = article[i].articleLater=="not-later-watch"?$("<button>").addClass("not-later-watch").appendTo(articleInfo):$("<button>").addClass("later-watch").appendTo(articleInfo);
                    var reading = $("<p>").text(article[i].articleReading).appendTo(articleInfo);
                }
                /*
                 * 添加"加载更多"按钮
                 */
                $("#addMore").remove();
                var addMore = $("<button>").text("加载更多").attr("id","addMore").appendTo($(".articles"));
            }
        }
    })
}



/*
 * 跳转详情页
 */
$(".container").on("click",".article-item",function(){
    window.open("content.html?id="+$(this).attr("id").substr(5),"_self");
})



/*
 * 轮播图
 * @size 轮播图张数
 * @width 轮播图宽度 656/937
 * 初始化→设置轮播效果
 */
function carousel(size){
    /*
     * 初始化"轮播图"
     */
    var width = $(".carousel-chart").width();
    $.ajax({
        type: "GET",
        //url:"json/carousel.json",
        url: urlPre+"/api/getCarousel",
        data: {
            "imgSize": size
        },
        dataType: "json",
        success: function(data){
            console.log(data);
            if(data.msg=="success"){
                /*
                 * 获取"轮播图"数据
                 */
                var carousel = data.carousel;
                var chart = $(".carousel-chart");
                var ul = $("<ul>").appendTo(chart);
                for(var i=0;i<carousel.length;i++){
                    var item = $("<li>").attr("id","carousel"+i).css({"left":i*width}).appendTo(ul).click(function(){
                        window.open("content.html?id="+$(this).find("img").attr("id").substr(5),"_self");
                    });
                    var img = $("<img>").attr("src",carousel[i].carouselImg,"id","issay"+carousel[i].articleId).appendTo(item);
                    var title = $("<h1>").text(carousel[i].carouselTitle).appendTo(item);
                    var shadow = $("<span>").appendTo(item);
                }

                /*
                 * 添加"轮播图"按钮
                 */
                for(var i=0;i<carousel.length;i++){
                    var button = width==656?$("<button>").attr("id","turn"+(carousel.length-i)).css({"right":i*28+20}).appendTo(chart):$("<button>").attr("id","turn"+(carousel.length-i)).css({"right":i*35+20}).appendTo(chart);
                    if(i==carousel.length-1) button.addClass("carousel-hover");
                }
            }
        }
    })

    /*
     * 定时自动轮播
     */
    setInterval(function(){
        /*
         * 轮播动画
         */
        for(var i=0;i<size;i++){
            var priLeft = $(".carousel-chart").find("li").eq(i).position().left;
            if(i==size-1){
                $(".carousel-chart").find("li").eq(size-1).animate({left:priLeft-width},450,function(){
                    $(".carousel-chart").find("li").eq(size-1).after($(".carousel-chart").find("li").eq(0));
                    $(".carousel-chart").find("li").eq(size-1).css({"left":priLeft});
                    /*
                     * 轮播按钮样式
                     */
                    var id = $(".carousel-chart").find("li").eq(0).attr("id").substr(8)-'0'+1;
                    $("#turn"+id).addClass("carousel-hover");
                    $(".carousel-chart button").not("#turn"+id).each(function(){
                        $(this).removeClass("carousel-hover");
                    });
                });
            }
            else{
                $(".carousel-chart").find("li").eq(i).animate({left:priLeft-width},450);
            }
        }
    },3000);
}
carousel(4);


/*
 * 稍后再看
 * 1. 传送数据
 *    @id 文章id
 *    @action 添加/删除
 * 2. 点击切换
 */
laterWatch(".not-later-watch");
laterWatch(".later-watch");
function laterWatch(selector){
    var action = selector==".not-later-watch"?"add":"delete";
    var id;
    $(".articles").on("click",selector,function(e){
        var cookieid = getCookie("cookieid");
        var btn = $(this);
        id = $(this).parent().parent(".article-item").attr("id").substr(5);
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
                if (data.status=='0') {
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
                event.stopPropagation();
            }
        })

    })
}


