//var urlPre = 'http://127.0.0.1:8000';
var urlPre = 'http://52.82.124.217:9998';

var args = new Object();
args = GetUrlParms();
var urlRequest = decodeURI(document.location.href);
var sort = args["sort"]==undefined?"":args["sort"];
var searchWord = args["searchWord"]==undefined?"":args["searchWord"];
var pageNumber=0;
var pageSize=6;
var year = null;
var month = null;
var day = null;
// console.log("sort="+sort+",searchWord="+searchWord+",year="+year+",month="+month+",day="+day);
/*
 * 初始化列表
 */
listLoad(sort,searchWord,pageNumber,pageSize,year,month,day);

/*
 * 加载更多
 */
$(".articles").on("click","#addMore",function(){
    listLoad(sort,searchWord,pageNumber++,pageSize,year,month,day);
})
/*
 * 导航切换
 */
$(".sidenav").find("li").click(function(){
    sort = $(this).text();
    window.open("list.html?sort="+sort,"_self");
    year = null;
    month = null;
    day = null;
    listLoad(sort,searchWord,pageNumber,pageSize,year,month,day);
    calendarPri(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate());//初始化
})



/*
 * 请求列表数据
 */
function listLoad(sort,searchWord,pageNumber,pageSize,year,month,day){
    /*
     * 是搜索结果页
     */
    if(searchWord){
        $("#asearchInput").val(searchWord);
        $(".list").find(".input-wrap").css("display","block");
        $(".list").find(".sort-title").css("display","none");
        $(".side-wrap").css("display","none");
        var cookieid = getCookie("cookieid");
        $.ajax({
            type:"GET",
            //url:"json/addMore.json",
            url:urlPre+"/api/searchResult",
            data:{
                "cookieid":cookieid,
                "searchWord":searchWord,
                "pageNumber":pageNumber,
                "pageSize":pageSize,
                "year":year,
                "month":month,
                "day":day
            },
            dataType: "json",
            success: function(data){
                if(data.msg=="success"){
                    var article = data.article;
                    var list = $(".articles");
                    for(var i=0;i<article.length;i++){
                        var articleItem = $("<div>").attr("id","issay"+article[i].articleId).addClass("article-item").appendTo(list);
                        var img = $("<img>").attr("src",article[i].articleImg).appendTo(articleItem);
                        var articleInfo = $("<div>").addClass("article-info").appendTo(articleItem);
                        var title = $("<h1>").text(article[i].articleTitle).addClass("hot"+article[i].articleHot).appendTo(articleInfo);
                        var later = article[i].articleLater=="not-later-watch"?$("<button>").addClass("not-later-watch").appendTo(articleInfo):$("<button>").addClass("later-watch").appendTo(articleInfo);
                        var through = $("<span>").text(article[i].articleThrough+"人浏览").appendTo(articleInfo);
                        var time = $("<span>").text(getDateDiff(article[i].articleTime)).appendTo(articleInfo);
                        var reading = $("<p>").text(article[i].articleReading).appendTo(articleInfo);
                    }
                    /*
                     * 更新"加载更多"按钮
                     */
                    $("#addMore").remove();
                    var addMore = $("<button>").text("加载更多").attr("id","addMore").appendTo($(".articles"));

                }

            }
        })
    }
    /*
     * 是普通列表页
     */
    else {
        var cookieid = getCookie("cookieid");
        if(sort=="短趣"||sort=="传言"){
            $(".list").find(".input-wrap").css("display","none");
            $(".list").find(".sort-title").css("display","block");
            $(".side-wrap").css("display","none");
        }else {
            $(".list").find(".input-wrap").css("display","none");
            $(".list").find(".sort-title").css("display","block");
            $(".side-wrap").css("display","block");
            $(".sidenav").find(".btn-chosed").removeClass("btn-chosed");
            $(".sidenav").find("li:contains("+sort+")").addClass("btn-chosed");
        }
        $(".sort-title").find("span").text(sort);
        $.ajax({
            type:"GET",
            //url:"json/index.json",
            url:urlPre+"/api/getList",
            data:{
                "cookieid":cookieid,
                "sort":sort,
                "pageNumber":pageNumber,
                "pageSize":pageSize,
                "year":year,
                "month":month,
                "day":day
            },
            dataType: "json",
            success:function(data){
                if(data.msg=="success"){
                    var list = $(".articles");
                    if(pageNumber==0)
                        list.empty();
                    if(sort=='传言'){
                        var gossip = data.article;
                        for(var i=0;i<gossip.length;i++){
                            var gossipItem = $("<div>").attr("id","issay"+gossip[i].articleId).addClass("article-item").appendTo(list);
                            var img = $("<img>").attr("src",gossip[i].articleImg).appendTo(gossipItem);
                            var articleInfo = $("<div>").addClass("article-info").appendTo(gossipItem);
                            var title = $("<h1>").text(gossip[i].articleTitle).appendTo(articleInfo);
                            var statusText;
                            switch(gossip[i].gossipStatus){
                                case "not-refuted":
                                    statusText="传言中";break;
                                case "refuted":
                                    statusText="已辟谣";break;
                                case "confirmed":
                                    statusText="已证实";break;
                            }
                            var status = $("<span>").text(statusText).addClass(gossip[i].gossipStatus).appendTo(articleInfo);
                        }
                    }else {
                        var article = data.article;
                        for(var i=0;i<article.length;i++){
                            var articleItem = $("<div>").attr("id","issay"+article[i].articleId).addClass("article-item").appendTo(list);
                            var img = $("<img>").attr("src",article[i].articleImg).appendTo(articleItem);
                            var articleInfo = $("<div>").addClass("article-info").appendTo(articleItem);
                            var title = $("<h1>").text(article[i].articleTitle).addClass("hot"+article[i].articleHot).appendTo(articleInfo);
                            var later = article[i].articleLater=="not-later-watch"?$("<button>").addClass("not-later-watch").appendTo(articleInfo):$("<button>").addClass("later-watch").appendTo(articleInfo);
                            var through = $("<span>").text(article[i].articleThrough+"人浏览").appendTo(articleInfo);
                            var time = $("<span>").text(getDateDiff(article[i].articleTime)).appendTo(articleInfo);
                            var reading = $("<p>").text(article[i].articleReading).appendTo(articleInfo);
                        }
                    }
                    /*
                     * 更新"加载更多"按钮
                     */
                    $("#addMore").remove();
                    var addMore = $("<button>").text("加载更多").attr("id","addMore").appendTo($(".articles"));

                }
            }
        })
    }
}


/*
 * 搜索框搜索
 */
$("#asearchInput").click(function(){
    var searchWord = $("#asearchInput").val();
    if(!searchWord){
        searchWord = $("#asearchInput").attr("placeholder");
    }
    window.open("list.html?searchWord="+searchWord,"_self");
})


/*
 * 稍后再看
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
                        url: urlPre+"/api/laterWatch",
                        //url: "/api/laterWatch",
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

/*
 * 侧边栏固定
 */
$(function(){
    var topH = $(".side-wrap").offset().top;
    var rightH = $(".right-aside").offset().top;
    $(window).scroll(function(){
        var navH = $(".side-wrap").offset().top;
        var footerH = $(".footer").offset().top;
        var barH = parseInt($(".side-wrap").css("height"));
        var scroH = $(window).scrollTop();
        if(footerH <= navH + barH + 20){
            $(".side-wrap").css({"position":"fixed","top": (footerH - scroH - barH) - 20});
        }else if(footerH > navH + barH + 100) {
            $(".side-wrap").css({"position":"fixed","top":topH});
        }
    });
    $(window).scroll(function () {
        var navH = $(".right-aside").offset().top;
        var footerH = $(".footer").offset().top;
        var barH = parseInt($(".right-aside").css("height"));
        var scroH = $(window).scrollTop();
        if (scroH > rightH) {
            if(footerH <= navH + barH + 20){
                $(".right-aside").css({"position":"fixed","top": (footerH - scroH - barH) - 20});
            }else if(footerH > navH + barH + 100) {
                $(".right-aside").css({"position":"fixed","top":0});
            }
        }
        else if (scroH <= rightH) {
            $(".right-aside").css({ "position": "static" });
        };
    });
})

/*
 * 跳转详情页
 */
$(".container").on("click",".article-item",function(){
    window.open("content.html?id="+$(this).attr("id").substr(5),"_self");
})

/*
 * 解析url辅助函数
 */
function GetUrlParms() {
    var args=new Object();
    var query=location.search.substring(1);
    var pairs=query.split("&");
    for(var i=0;i<pairs.length;i++) {
        var pos=pairs[i].indexOf('=');
        if(pos==-1)   continue;
        var argname=pairs[i].substring(0,pos);
        var value=pairs[i].substring(pos+1);
        args[argname]=decodeURI(value);
    }
    return args;
}


/*
 * 日历功能
 */
$(function(){
    calendarPri(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate());//初始化
    clickListener("#lastYear");
    clickListener("#nextYear");
    clickListener(".month li");
    clickListener(".day li");
    function clickListener(ele){
        $(".calendar").on('click',ele,function(){
            switch(ele){
                case "#lastYear":
                    $(".year").find("h1").text(year-1);
                    break;
                case "#nextYear":
                    $(".year").find("h1").text(year+1);
                    break;
                case ".month li":
                    var btn = $(this);
                    $(".month").find(".btn-chosen").removeClass("btn-chosen");
                    btn.addClass("btn-chosen");
                    break;
                case ".day li":
                    var btn = $(this);
                    $(".day").find(".btn-chosen").removeClass("btn-chosen");
                    btn.addClass("btn-chosen");
                    break;
            }
            year = $(".year").find("h1").text()-'0';
            month = $(".month").find(".btn-chosen").text()-'0';
            day = $(".day").find(".btn-chosen").text()-'0';
            calendarPri(year,month,day);
            listLoad(sort,searchWord,0,pageSize,year,month,day);
        })
    }
})

function calendarPri(year,month,day){//日历初始化
    var count = getMonthDays(year,month);//计数
    var startW = getWeekday(year,month,1)-1;//从第几个li开始
    $(".year").find("h1").text(year);
    $(".month").find(".btn-chosen").removeClass("btn-chosen");
    $(".month").find("li").each(function(){
        if($(this).text()==month+""){
            $(this).addClass("btn-chosen");
        }
    });
    var list = $(".day-wrap");
    list.empty();
    for(var i=0,d=1;i<42;i++){
        if(i>=startW && i<startW+count){
            if((i-startW)==(day-1)){
                var li = $("<li>").addClass("btn-chosen").text(i-startW+1).appendTo(list);
            }else {
                var li = $("<li>").text(i-startW+1).appendTo(list);
            }
        }else {
            var li = $("<li>").appendTo(list);
        }
    }
}
function getMonthDays(year, month){//获取某年某个月有几天
    return new Date(year, month, 0).getDate();
}
function getWeekday(year, month, day){//获取某日期是星期几
    return new Date(year, month-1, day).getDay();
}



